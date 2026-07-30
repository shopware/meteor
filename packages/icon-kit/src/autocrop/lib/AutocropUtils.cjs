
const Ensure = require('./Ensure.cjs');

const ImageBounds = Ensure.clazz(require('./ImageBounds.cjs'));
const SvgTranslate = Ensure.clazz(require('./SvgTranslate.cjs'));
const SvgTranslateError = Ensure.clazz(require('./SvgTranslateError.cjs'));
const SvgUtils = Ensure.clazz(require('./SvgUtils.cjs'));

module.exports = class AutocropUtils {

	/**
	 * See 'README.md#Parameters' for documentation on supported parameters.
	 */
	static plugin(ast, params, info) {
		try {
			// Get <svg> attributes
			let attribs = AutocropUtils.getSvgAttribs(ast);
			let includeWidthAndHeightAttributes = AutocropUtils.isIncludeWidthAndHeightAttributes(params, attribs);
	
			// Get viewbox as specified by <svg viewbox> or implied by <svg width/height>
			let viewbox = AutocropUtils.getViewbox(attribs);

			// Ensure width/height set (need svg to be fixed size rather than scaling to screen)
			attribs.width = '' + viewbox.width;
			attribs.height = '' + viewbox.height;
			let svg = SvgUtils.js2svg(ast);

			// Only render svg on first first call. We still do everything else - like translate - because after <svg> is optimised, translate may be able to succeed if it was previously failing.
			let viewboxNew;
			let multipassCount = info.multipassCount;
			if ( multipassCount!==0 || params.autocrop===false ) {
				viewboxNew = viewbox;
			} else {
				// Get viewbox without padding
				viewboxNew = AutocropUtils.getViewboxWithoutPadding(svg, viewbox, params, info);

				// Add padding if any
				AutocropUtils.addPadding(viewboxNew, viewbox,
						ast, params, info);
			}

			// Attempt to translate back to (0,0) if not already (0,0)
			if (! AutocropUtils.translate(ast, params, viewboxNew, multipassCount) ) {
				// Rollback the ast by recreating the js representation. This has to be done because the ast may currently be in an inconsistent/only partially modified state.
				ast.children = SvgUtils.svg2js(svg).children;
				attribs = AutocropUtils.getSvgAttribs(ast);
			}

			// Set new viewbox
			AutocropUtils.setViewbox(attribs, viewboxNew, includeWidthAndHeightAttributes);
			if ( params.debug ) {
				console.log('Old viewbox: ' + JSON.stringify(viewbox) + '. New viewbox: ' + JSON.stringify(viewboxNew));
			}
		} catch ( e ) {
			console.error('Failed to process: ' + info.path);
			throw e;
		}
	}

	static getViewboxWithoutPadding(svg, viewbox, params, info) {
		// Rasterise the svg (resvg, no headless browser) and calculate/return non-transparent bounds.
		let bounds = ImageBounds.getBounds(svg, viewbox.width, viewbox.height);
		if ( bounds.width!=viewbox.width || bounds.height!=viewbox.height ) {
			throw new Error('Loaded png had unexpected width/height\n<svg viewbox>=' + JSON.stringify(viewbox) + ', png bounds=' + JSON.stringify(bounds));
		}
		return {
			x: viewbox.x + bounds.xMin,
			y: viewbox.y + bounds.yMin,
			width: bounds.xMax - bounds.xMin + 1,
			height: bounds.yMax - bounds.yMin + 1
		};
	}

	static addPadding(viewboxNew, viewbox,
		ast, params, info) {
		let padding = params.padding;
		if ( !padding ) {
			return;
		}
		let type = typeof padding;
		if ( type=='number' ) {
			viewboxNew.x -= padding;
			viewboxNew.y -= padding;
			viewboxNew.width += padding * 2;
			viewboxNew.height += padding * 2;
		} else if ( type=='object' ) {
			let top = Ensure.integer(padding.top, "padding.top");
			let bottom = Ensure.integer(padding.bottom, "padding.bottom");
			let left = Ensure.integer(padding.left, "padding.left");
			let right = Ensure.integer(padding.right, "padding.right");

			viewboxNew.x -= left;
			viewboxNew.y -= top;
			viewboxNew.width += left + right;
			viewboxNew.height += top + bottom;
		} else if ( type=='function' ) {
			padding(viewboxNew, viewbox,
				ast, params, info);
		} else {
			throw Ensure.unexpectedObject('Unsupported padding specified', padding);
		}
	}

	/**
	 * @return Returns true if successful or did nothing. Returns false if failure - and will need to roll back ast
     */
	static translate(ast, params, viewboxNew, multipassCount) {
		if ( params.disableTranslate ) {
			return true; // Nothing to do.
		}
		let x = viewboxNew.x;
		let y = viewboxNew.y;
		let removeClass = params.removeClass;
		let removeStyle = params.removeStyle;
		let removeDeprecated = params.removeDeprecated;
		let setColor = params.setColor;
		if ( x==0 && y==0 && !removeClass && !removeStyle && !removeDeprecated && !setColor ) {
			return true; // Nothing to do.
		}

		// Attempt to translate back to (0, 0)
		try {
			new SvgTranslate(-x, -y, multipassCount,
				removeClass, removeStyle, removeDeprecated, setColor, params.setColorIssue).translate(ast);
		} catch ( e ) {
			if ( e instanceof SvgTranslateError ) {
				let type = e.type;
				if ( type=='silentRollback' ) {
					return false; // Rollback!
				} else {
					throw e; // Fail outright when this error is thrown.
				}
			} else if (! params.disableTranslateWarning ) {
				console.warn("Failed to translate <svg> by (" + x + ", " + y + ") - this warning can be safely ignored and can be hidden by setting 'disableTranslateWarning=true'.\n"
					+ "Ideally you should update the code to fix this issue so translation can properly occur.\n"
					+ "The only impact of this warning is the top/left of the viewbox won't be (0, 0)\n", e);
			}
			return false; // Rollback!
		}

		// Return successfully translated ast
		viewboxNew.x = 0;
		viewboxNew.y = 0;
		return true;
	}

	static getSvgAttribs(ast) {
		let nodes = ast.children;
		let nodeCount;
		if ( !nodes || (nodeCount=nodes.length)<=0 ) {
			throw new Error('AST contains no nodes');
		}
		let index = 0;
		let svg;
		do {
			let node = nodes[index];
			if ( node.type=='element' && node.name=='svg' ) {
				if ( svg ) {
					throw new Error('AST contains multiple root <svg> elements');
				}
				svg = node;
			}
		} while ( ++index<nodeCount );
		if ( !svg ) {
			throw new Error("AST didn't contain root <svg> element");
		}
		return Ensure.notNull(svg.attributes, "<svg> attributes");
	}

	static getDebugWriteFilePrefix(params, info) {
		let value = params.debugWriteFiles;
		if (! value ) {
			return null;
		}
		let type = typeof value;
		if ( type=='boolean' ) {
			let path = info.path;
			if ( !path ) {
				throw new Error("Param 'debugWriteFiles' enabled - but couldn't determine path of SVG - set 'debugWriteFiles' to path instead so can write debug files");
			}
			return path;
		} else if ( type=='string' ) {
			return value;
		} else {
			throw new Ensure.unexpectedObject("Unknown 'debugWriteFiles' params value specified", value);
		}
	}

	static isIncludeWidthAndHeightAttributes(params, attribs) {
		let flag = params.includeWidthAndHeightAttributes;
		let type = typeof(flag);
		if ( type=='undefined' ) { // Default to including only if already included in svg.
			flag = attribs.width || attribs.height;
		} else if ( type!='boolean' ) {
			throw Ensure.unexpectedObject("Invalid 'includeWidthAndHeightAttributes' param - expected either 'boolean' or 'undefined' (which defaults to true/false depending on whether svg already includes a width/height", flag);
		}
		return flag;
	}
	
	/**
	 * @return Returns object taking the form {x, y, width, height}.
	 */
	static getViewbox(attribs) {
		let viewbox = attribs.viewBox;
		let x, y, width, height;
		if ( !viewbox ) {
			x = 0;
			y = 0;
			height = Ensure.integer(attribs.height, '<svg height>');
			width = Ensure.integer(attribs.width, '<svg width>');
		} else {
			Ensure.string(viewbox, '<svg viewbox>');
			let array = viewbox.split(/[ ,]+/);
			if ( array instanceof Array && array.length!=4 ) {
				throw new Error("Invalid <svg viewbox='" + viewbox + "'> attribute - expected viewbox to specify 4 parts.");
			}
			x = Ensure.integer(array[0], '<svg viewbox[0]>');
			y = Ensure.integer(array[1], '<svg viewbox[1]>');
			width = Ensure.integer(array[2], '<svg viewbox[2]>');
			height = Ensure.integer(array[3], '<svg viewbox[3]>');
		}
		return {x, y, width, height};
	}

	static setViewbox(attribs, viewbox, includeWidthAndHeightAttributes) {
		let width = viewbox.width;
		let height = viewbox.height;

		// Either update or set width/height
		if ( includeWidthAndHeightAttributes ) {
			attribs.width = '' + width;
			attribs.height = '' + height;
		} else {
			delete attribs.width;
			delete attribs.height;
		}

		// Set viewbox
		attribs.viewBox = viewbox.x + ' ' + viewbox.y + ' ' + width + ' ' + height;
	}

}
