
const Ensure = require('./Ensure.cjs');

const SVGPathData = Ensure.clazz(require('svg-pathdata').SVGPathData);
const SvgTranslateError = Ensure.clazz(require('./SvgTranslateError.cjs'));

module.exports = class SvgTranslate {

	/**
	 * @removeClass If true, then delete 'class' attribute.
	 * @removeStyle If true, then delete 'style' and other styling attributes.
	 * @removeDeprecated If true, then delete <svg version/baseProfile> attributes. Also deletes other non-standard/not useful attributes like 'sketch:type'/'data-name'/etc.
     * @setColor If provided, then replace all colors with color specified. Usually set to 'currentColor'.
     * @setColorIssue Either undefined/'warn', 'fail', 'rollback' or 'ignore'. See "README.md#Parameters" for a full description of these values.
	 */
	constructor(x, y, multipassCount,
			removeClass = false, removeStyle = false, removeDeprecated = false, setColor = undefined, setColorIssue = undefined) {
		this.x = x;
		this.y = y;
		this.multipassCount = multipassCount;

		this.removeClass = removeClass;
		this.removeStyle = removeStyle;
		this.removeDeprecated = removeDeprecated;

		this.setColor = setColor;
		this.previousColor = null; // Used to store lowercase color previously encountered. If 'setColor' is defined and we encounter more than one color, then we fail.
		if ( !setColorIssue || setColorIssue=='warn' ) {
			this.setColorIssue = null;
		} else if ( setColorIssue=='fail' || setColorIssue=='rollback' || setColorIssue=='ignore' ) {
			this.setColorIssue = setColorIssue;
		} else {
			throw Ensure.unexpectedObject('Invalid "params.setColorIssue" value specified', setColorIssue);
		}
	}

	/**
	 * Translate the ast by (x, y).
     *
     * Implementation works off a whitelist of known svg elements/attributes - if anything unknown is encountered, an exception is thrown.
     * If an exception is thrown, the caller has to rollback the ast themselves to the original unmodified version.
	 */
	translate(ast) {
		if ( ast.type!='root' ) {
			throw Ensure.unexpectedObject('Expected root', ast);
		}
		let hasSvg;
		for ( const child of ast.children ) {
			const type = child.type;
			if ( type=='element' && child.name=='svg' ) {
				if ( hasSvg ) {
					throw Ensure.unexpectedObject('Multiple <svg> elements found', ast);
				}
				hasSvg = true;
				this.#rootSvg(child);
			} else if ( type=='comment' || type=='instruction' || type=='doctype' ) {
				// Can ignore comments and instructions like <?xml ... ?>
			} else {
				throw Ensure.unexpectedObject('Unhandled node', child);
			}
		}
		if (! hasSvg ) {
			throw Ensure.unexpectedObject('No <svg> element found', ast);
		}
	}

	#rootSvg(svg) {
		this.#svg(svg);

		// Ensure color set to root <svg> if not set to any other part of the <svg>
		let setColor = this.setColor;
		if ( setColor && !this.previousColor ) {
			svg.attributes['fill'] = setColor;
		}
	}

	#svg(svg) {
		const attribs = svg.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='viewBox' ) {
				// TODO maybe do something?
			} else if ( attribName=='width' || attribName=='height' || attribName=='xmlns' || attribName=='enable-background' ) {
				// Ignore
			} else if ( attribName=='version' || attribName=='baseProfile' ) {
				if ( this.removeDeprecated ) { // Remove deprecated if requested
					delete attribs[attribName];
				}
			} else if ( attribName=='x' || attribName=='y' ) {
				let str = attribs[attribName];
				if ( !str || str=='0' || str=='0px' ) {
					delete attribs[attribName]; // Can just remove this - completely redundant.
				} else {
					this.#unhandledAttribute(svg, attribs, attribName);
				}
			} else {
				this.#unhandledAttribute(svg, attribs, attribName);
			}
		}
		this.#handleChildren(svg);
	}

	#handleChildren(node) {
		for ( const child of node.children ) {
			const type = child.type;
			if ( type=='element' ) {
				const name = child.name.toLowerCase();
				if ( name=='g' ) {
					this.#g(child);
				} else if ( name=='path' ) {
					this.#path(child);
				} else if ( name=='rect' ) {
					this.#rect(child);
				} else if ( name=='line' ) {
					this.#line(child);
				} else if ( name=='polyline' ) {
					this.#polyline(child);
				} else if ( name=='polygon' ) {
					this.#polygon(child);
				} else if ( name=='circle' ) {
					this.#circle(child);
				} else if ( name=='ellipse' ) {
					this.#ellipse(child);
				} else if ( name=='defs' ) {
					this.#defs(child);
				} else if ( name=='title' || name=='desc' ) {
					// Can just ignore title/description
				} else {
					throw Ensure.unexpectedObject('Unhandled element', child);				
				}
			} else if ( type=='comment' ) {
				// Can ignore comments
			} else {
				throw Ensure.unexpectedObject('Unhandled node type "' + type + '"', child);
			}
		}
	}

	#ensureNoChildren(node) {
		let children = node.children;
		if ( children && children.length>0 ) {
			throw Ensure.unexpectedObject('Unexpected/unhandled children', node);
		}
	}

	#unhandledAttribute(node, attribs, attribName) {
		if ( attribName ) { // For full list, see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
			if (attribName=='fill' || attribName=='stroke' || attribName=='color'
					|| attribName=='stop-color' || attribName=='flood-color' || attribName=='lighting-color' ) {
				this.#translateColor(node, attribs, attribName);
				return;
			} else if ( attribName=='class' ) {
				if ( this.removeClass ) {
					delete attribs[attribName];
				}
				return;
			} else if ( attribName=='style' || attribName=='font-family' ) {
				if ( this.removeStyle ) {
					delete attribs[attribName];
				}
				return;
			} else if ( attribName=='overflow' ) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/overflow
				if ( this.removeStyle ) {
					let value = attribs[attribName];
					if ( !value || value=='visible' ) { // 'overflow=visible' is the default - so just remove this.
						delete attribs[attribName];
					}
				}
				return;
			} else if ( attribName=='enable-background' || attribName=='data-name' || attribName=='xml:space'
					|| attribName=='xmlns:sketch' || attribName.startsWith('sketch:')) { // Note: most common 'sketch:' attribute is 'sketch:type'.
				if ( this.removeDeprecated ) { // Remove deprecated/redundant if requested
					delete attribs[attribName];
				}
				return;
			} else if ( attribName=='transform' ) {
				let multipassCount = this.multipassCount;
				if ( multipassCount===0 ) {
					throw SvgTranslateError.silentRollback("Svgo's 'convertTransform' plugin will often remove transforms. During the next run potentially no transform attribute will be present.");
				} else {
					throw Ensure.unexpectedObject("Svgo's 'convertTransform' is either not enabled or failed to remove <" + node.name + " transform='" + attribs[attribName] + "'> on the first pass.\n"
						+ "If this was a simple transform, consider confirming the svgo default plugins or at least the 'convertTransform' plugin are in your svgo configuration file.", node);
				}
			} else if (attribName=='id'
					|| attribName=='opacity' || attribName=='display'
				    || attribName.startsWith('fill-') || attribName.startsWith('stroke-') || attribName.startsWith('clip-')
					|| attribName.startsWith('xmlns:') || attribName.startsWith('xml:')) {
				return; // Can somewhat safely ignore these.
			}
		}
		throw Ensure.unexpectedObject('Unhandled <' + node.name + ' ' + attribName + '> attribute', node);
	}

	#translateX(node, attribs, attribName) {
		let x = this.x;
		if ( x!==0 ) {
			let num = this.#getAttribNumber(node, attribs, attribName);
			attribs[attribName] = '' + (num + x);
		}
	}

	#translateY(node, attribs, attribName) {
		let y = this.y;
		if ( y!==0 ) {
			let num = this.#getAttribNumber(node, attribs, attribName);
			attribs[attribName] = '' + (num + y);
		}
	}

	#translateColor(node, attribs, attribName) {
		let setColor = this.setColor;
		if (!setColor) {
			return;
		}

		// Get value		
		let value = attribs[attribName];
		if ( !value || (value = value.trim()).length<=0 ) {
			delete attribs[attribName];
			return;
		}
		value = value.toLowerCase();

		// Set color
		if ( value!='none' ) {
			// 'color="currentColor"' is always redundant - setting color to the 'currentColor' has no effect given the previous color was already 'currentColor'.
			if ( attribName=='color' && setColor=='currentColor' ) {
				delete attribs[attribName];
				return;
			}

			// Compare to previous color
			let previousColor = this.previousColor;
			if ( !previousColor ) {
				this.previousColor = value;
			} else if ( previousColor!=value ) { // Note: case insensitive comparison.
			    let setColorIssue = this.setColorIssue;
				if ( setColorIssue!='ignore' ) {
					let message = 'Expected single color/monotone <svg>, however multiple colors encountered in <svg> - previous color "'
						+ previousColor + '", but just encountered <' + node.name + ' ' + attribName + '="' + attribs[attribName] + '"> attribute with different color';
					if ( !setColorIssue || setColorIssue=='warn' ) {
						console.warn(message);
					} else if ( setColorIssue=='rollback' ) {
						throw Ensure.unexpectedObject(message, node);
					} else {
						throw SvgTranslateError.fail(message);
					}
				}
			}
			
			// Set color
			attribs[attribName] = setColor;
		}
	}

	#getAttribString(node, attribs, attribName) {
		let str = attribs[attribName];
		if ( typeof str != 'string' ) {
			throw Ensure.unexpectedObject('Invalid <' + node.name + ' ' + attribName + '> attribute - expected string', node);
		} else if ( str.length<=0 ) {
			throw Ensure.unexpectedObject('Invalid <' + node.name + ' ' + attribName + '> attribute - empty string specified for attribute', node);
		}
		return str;
	}

	#getAttribNumber(node, attribs, attribName) {
		let str = this.#getAttribString(node, attribs, attribName);
		let num = Number(str);
		if (! isFinite(num) ) {
			throw Ensure.unexpectedObject('Invalid <' + node.name + ' ' + attribName + '="' + str + '"> attribute - invalid number', node);
		}
		return num;
	}

	#defs(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			this.#unhandledAttribute(node, attribs, attribName);
		}
		this.#ensureNoChildren(node);
	}

	#g(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			this.#unhandledAttribute(node, attribs, attribName);
		}
		this.#handleChildren(node);
	}

	#path(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#path
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='d' ) {
				let x = this.x;
				let y = this.y;
				if ( x!==0 || y!==0 ) {
					let data = attribs.d;
					let dataNew = new SVGPathData(data).toAbs().translate(x, y).round(1e14).encode();
					attribs.d = dataNew;
				}
			} else {
				this.#unhandledAttribute(node, attribs, attribName);
			}
		}
		this.#ensureNoChildren(node);
	}

	#rect(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#rectangle
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='x' ) {
				this.#translateX(node, attribs, attribName);
			} else if ( attribName=='y' ) {
				this.#translateY(node, attribs, attribName);
			} else if ( attribName=='width' || attribName=='height' || attribName=='rx' || attribName=='ry' ) {
				// Can safely ignore these
			} else {
				this.#unhandledAttribute(node, attribs, attribName);
			}
		}
		this.#ensureNoChildren(node);
	}

	#line(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#line
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='x1' || attribName=='x2' ) {
				this.#translateX(node, attribs, attribName);
			} else if ( attribName=='y1' || attribName=='y2' ) {
				this.#translateY(node, attribs, attribName);
			} else {
				this.#unhandledAttribute(node, attribs, attribName);
			}
		}
		this.#ensureNoChildren(node);
	}

	#polyline(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#polyline
		this.#_silentRollbackIfFirstPass(node);
	}

	#polygon(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#polygon
		this.#_silentRollbackIfFirstPass(node);
	}

	#_silentRollbackIfFirstPass(node) {
		let multipassCount = this.multipassCount;
		if ( multipassCount===0 ) {
			throw SvgTranslateError.silentRollback("Svgo's 'convertShapeToPath' plugin will convert this to <path d> - which we can translate on next call");
		} else {
			throw Ensure.unexpectedObject("Svgo's 'convertShapeToPath' was meant to convert <" + node.name + "> to <path d> on the first pass,"
				+ " however it's multipassCount=" + multipassCount + " and this <" + node.name + "> element hasn't been replaced.\n"
				+ "Please confirm svgo default plugins or at least the 'convertShapeToPath' plugin are in your svgo configuration file.", node);
		}
	}

	#circle(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#circle
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='cx' ) {
				this.#translateX(node, attribs, attribName);
			} else if ( attribName=='cy' ) {
				this.#translateY(node, attribs, attribName);
			} else if ( attribName=='r' ) {
				// Can safely ignore these
			} else {
				this.#unhandledAttribute(node, attribs, attribName);
			}
		}
		this.#ensureNoChildren(node);
	}

	#ellipse(node) { // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes#ellipse
		const attribs = node.attributes;
		for ( const attribName in attribs ) {
			if ( attribName=='cx' ) {
				this.#translateX(node, attribs, attribName);
			} else if ( attribName=='cy' ) {
				this.#translateY(node, attribs, attribName);
			} else if ( attribName=='rx' || attribName=='ry' ) {
				// Can safely ignore these
			} else {
				this.#unhandledAttribute(node, attribs, attribName);
			}
		}
		this.#ensureNoChildren(node);
	}

}
