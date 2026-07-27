
const Ensure = require('./Ensure.cjs');
const { Resvg } = require('@resvg/resvg-js');

/**
 * Browser-free replacement for the old puppeteer + jimp + worker-thread rendering pipeline.
 *
 * Renders the SVG to a transparent RGBA bitmap using resvg (a Rust rasterizer shipped as a
 * prebuilt binary - no headless browser download) and returns the bounds of the visible
 * (alpha > 0) pixels. The scan logic is a straight port of the original ImageUtils.getBounds
 * so the resulting crop is identical to the previous puppeteer implementation.
 *
 * @return Returns {width, height, xMin, yMin, xMax, yMax}
 */
module.exports = class ImageBounds {

	static getBounds(svg, width, height) {
		Ensure.string(svg);
		Ensure.integerStrict(width);
		Ensure.integerStrict(height);

		// Rasterise at the SVG's intrinsic size (== viewBox size, since <svg width/height> are set
		// to the viewBox dimensions before this is called). Background is left transparent, matching
		// the old puppeteer 'omitBackground: true' screenshot.
		const rendered = new Resvg(svg, { fitTo: { mode: 'original' } }).render();
		const w = rendered.width;
		const h = rendered.height;
		const data = rendered.pixels; // RGBA, row-major, same layout jimp exposed.
		if ( w < 0 || h < 0 ) {
			throw new Error('Invalid image dimensions; width=' + w + ', height=' + h);
		}

		// Scan image determining bounds of visible pixels (port of ImageUtils.getBounds).
		let xMin, xMax, yMin, yMax;
		for ( let y = 0; y < h; y++ ) {
			for ( let x = 0; x < w; x++ ) {
				const idx = (y * w + x) * 4;
				const alpha = data[idx + 3];
				if ( alpha > 0 ) {
					// Avoid truthy issues (i.e. (!!0)===false) by incrementing x/y by 1.
					const px = x + 1;
					const py = y + 1;
					if ( !xMin ) { // Set all coordinates for first visible pixel
						xMin = xMax = px;
						yMin = yMax = py;
					} else {
						if ( px < xMin ) {
							xMin = px;
						} else if ( px > xMax ) {
							xMax = px;
						}
						if ( py < yMin ) {
							yMin = py;
						} else if ( py > yMax ) {
							yMax = py;
						}
					}
				}
			}
		}
		if ( !xMin ) {
			throw new Error('Image has no visible pixels');
		}
		xMin--;
		yMin--;
		xMax--;
		yMax--;

		const result = { width: w, height: h, xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax };
		if (!( 0 <= xMin && xMin <= xMax && xMax < w && 0 <= yMin && yMin <= yMax && yMax < h )) {
			throw new Error('Unexpected - invalid bounds calculated: ' + JSON.stringify(result));
		}
		return result;
	}

}
