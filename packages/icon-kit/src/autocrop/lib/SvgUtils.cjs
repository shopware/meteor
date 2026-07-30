
const Ensure = require('./Ensure.cjs');
const path = Ensure.object(require('path'));

const svgDirName = path.dirname(require.resolve('svgo'));
const _stringifySvg = Ensure.func(require(path.join(svgDirName, '/stringifier.js')).stringifySvg); // Ugly way of loading "{repo}/node_modules/svgo/lib/stringifier.js".
const _parseSvg = Ensure.func(require(path.join(svgDirName + '/parser.js')).parseSvg); // Ugly way of loading "{repo}/node_modules/svgo/lib/parser.js".

module.exports = class SvgUtils {

	/**
	 * Parse the SVG/XML string provided - and return the javascript in-memory representation.
     *
	 * @param str SVG/XML string.
	 * @param path Optional SVG path - only used if reporting error.
     */
	static svg2js(str, path) {
		return _parseSvg(str, path);
	}

	/**
	 * Format the AST/Javascript in-memory representation back to the SVG/XML string.
	 */
	static js2svg(ast) {
		return _stringifySvg(ast).data;
	}

}
