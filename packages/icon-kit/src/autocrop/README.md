# autocrop (vendored)

This directory is a vendored, lightly-modified copy of the SVGO plugin
[`svgo-autocrop`](https://www.npmjs.com/package/svgo-autocrop) (v1.1.1, MIT licensed,
© Glennos). It reduces an icon's `viewBox` to the smallest box that still contains all
visible pixels and translates the geometry back to the origin.

## Why it is vendored

The upstream package renders every SVG in **headless Chrome via `puppeteer`** purely to
compute a pixel-accurate bounding box. `puppeteer` is a hard dependency, so a Chromium
binary was downloaded on nearly every `pnpm install`, which was slow and flaky in CI. The
package is also no longer actively maintained.

Vendoring lets us keep the exact cropping/translating behaviour (so generated icons do not
change) while replacing **only** the renderer.

## What was changed vs. upstream

- Removed `lib/Browser.js`, `lib/ImageUtils.js`, `lib/WorkerThead.js`,
  `lib/WorkerTheadParent.js` and `lib/WorkerTheadUtils.js` — the puppeteer + jimp +
  worker-thread rendering pipeline.
- Added [`lib/ImageBounds.cjs`](lib/ImageBounds.cjs): rasterises the SVG with
  [`@resvg/resvg-js`](https://www.npmjs.com/package/@resvg/resvg-js) (a Rust rasterizer
  shipped as a prebuilt binary — no browser) and scans for the `alpha > 0` bounds. The scan
  is a straight port of the original `ImageUtils.getBounds`, and because `resvg` renders
  synchronously the async worker-thread machinery is no longer needed.
- [`lib/AutocropUtils.cjs`](lib/AutocropUtils.cjs): `getViewboxWithoutPadding` now calls
  `ImageBounds.getBounds` instead of `WorkerTheadParent.getBounds`. Nothing else changed.

`lib/SvgTranslate.cjs`, `lib/SvgTranslateError.cjs`, `lib/SvgUtils.cjs` and `lib/Ensure.cjs`
are verbatim copies.

The files use the `.cjs` extension because this package is ESM (`"type": "module"`) but the
vendored code is CommonJS; `.cjs` forces CommonJS per-file, so no extra config is needed.

## Equivalence

The change was validated against 891 raw-input → committed-output pairs captured in
`run.log` (the last full generation run): the resvg-based pipeline produces **byte-for-byte
identical** output for every icon, including the hairline antialiasing cases.
