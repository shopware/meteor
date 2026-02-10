# @shopware-ag/meteor-tokens

## 1.4.0

### Minor Changes

- [#1049](https://github.com/shopware/meteor/pull/1049) [`01879a1`](https://github.com/shopware/meteor/commit/01879a18a412afbaf96c070f7b5fa459a8a56b39) Thanks [@alastair-simon](https://github.com/alastair-simon)! - - Upgraded typescript-eslint from 8.24.1 to 8.35.0
  - Migrated from eslint-plugin-vitest to @vitest/eslint-plugin
  - Upgraded @types/node from 22.13.4 to 25.0.0

## 1.3.1

### Patch Changes

- e14b1ea: mark every dependency as a dev dependency

## 1.3.0

### Minor Changes

- 9a63888: Add description to all Design Tokens

## 1.2.0

### Minor Changes

- 19ca0a3: Update tokens

  - Added `color/interaction/secondary/pressed`
  - Added `color/elevation/backdrop/default`
  - Added `color/elevation/floating/default`
  - Added `color/background/secondary/default`
  - Added `color/background/tertiary/default`
  - Added `color/icon/primary/inverse`
  - Added `color/icon/secondary/default`
  - Added `color/icon/secondary/disabled`
  - Added `color/icon/secondary/inverse`
  - Added `color/icon/brand/pressed`
  - Added `color/text/primary/inverse`
  - Added `color/text/secondary/inverse`
  - Added `color/text/brand/pressed`
  - Added `color/text/critical/pressed`
  - Added `color/text/brand/inverse`
  - Added `color/static/white`
  - Added `color/static/black`
  - Changed `color/interaction/primary/hover` to map to `color/brand/600` instead of `color/brand/700` in light and dark mode
  - Changed `color/interaction/primary/pressed` to map to `color/brand/700` instead of `color/brand/600` in light and dark mode
  - Changed `color/interaction/primary/disabled` to map to `color/brand/800` instead of `color/brand/300` in dark mode
  - Changed `color/interaction/critical/hover` to map to `color/red/600` instead of `color/red/700` in light and dark mode
  - Changed `color/interaction/critical/pressed` to map to `color/red/700` instead of `color/red/600` in light and dark mode
  - Changed `color/interaction/critical/disabled` to map to `color/red/800` instead of `color/red/200` in dark mode
  - Changed `color/interaction/secondary/default` to map to `color/zinc/900` instead of `color/zinc/850` in dark mode
  - Changed `color/interaction/secondary/hover` to map to `color/zinc/850` instead of `color/zinc/800` in dark mode
  - Changed `color/interaction/secondary/pressed` to map to `color/zinc/800` instead of `color/zinc/900` in dark mode
  - Changed `color/elevation/surface/sunken` to map to `color/zinc/1000` instead of `color/zinc/975` in dark mode
  - Changed `color/elevation/surface/default` to map to `color/zinc/975` instead of `color/zinc/950` in dark mode
  - Changed `color/elevation/surface/raised` to map to `color/zinc/950` instead of `color/zinc/900` in dark mode
  - Changed `color/elevation/surface/floating` to map to `color/elevation/floating/default`
  - Changed `color/background/brand/default` to map to `color/brand/900` instead of `color/brand/800` in dark mode
  - Changed `color/background/critical/default` to map to `color/red/900` instead of `color/red/800` in dark mode
  - Changed `color/background/attention/default` to map to `color/orange/900` instead of `color/orange/800` in dark mode
  - Changed `color/background/positive/default` to map to `color/green/900` instead of `color/green/800` in dark mode
  - Changed `color/background/accent/default` to map to `color/purple/900` instead of `color/purple/800` in dark mode
  - Changed `color/background/primary/default` to map to `color/zinc/0` in light mode
  - Changed `color/background/primary/default` to map to `color/zinc/900` in dark mode
  - Changed `color/background/primary/disabled` to map to `color/background/tertiary/default`
  - Changed `color/background/critical/dark` to map to `color/background/critical/default`
  - Changed `color/icon/primary/default` to map to `color/zinc/900` instead of `color/zinc/700` in light mode
  - Changed `color/icon/primary/default` to map to `color/zinc/50` instead of `color/zinc/100` in dark mode
  - Changed `color/icon/primary/disabled` to map to `color/zinc/300` instead of `color/zinc/200` in light mode
  - Changed `color/icon/primary/disabled` to map to `color/zinc/600` instead of `color/zinc/500` in dark mode
  - Changed `color/icon/brand/hover` to map to `color/brand/600` instead of `color/brand/700` in light and dark mode
  - Changed `color/icon/brand/disabled` to map to `color/brand/700` instead of `color/brand/300` in dark mode
  - Changed `color/icon/critical/default` to map to `color/red/500` instead of `color/red/400` in dark mode
  - Changed `color/icon/critical/disabled` to map to `color/red/800` instead of `color/red/300` in dark mode
  - Changed `color/icon/static/default` to map to `color/static/white` in light and dark mode
  - Changed `color/icon/static/dark` to map to `color/static/black` in light and dark mode
  - Changed `color/icon/inverse/default` to map to `color/icon/primary/inverse` instead of `color/zinc/50` in light mode
  - Changed `color/icon/inverse/default` to map to `color/icon/primary/inverse` instead of `color/zinc/850` in dark mode
  - Changed `color/border/brand/selected` to map to `color/border/brand/default`
  - Changed `color/border/brand/default` to map to `color/brand/500` in dark and light mode
  - Changed `color/border/brand/disabled` to map to `color/brand/700` instead of `color/brand/300` in dark mode
  - Changed `color/border/critical/disabled` to map to `color/red/700` instead of `color/red/300` in dark mode
  - Changed `color/border/secondary/default` to map to `color/zinc/850` instead of `color/zinc/800` in dark mode
  - Changed `color/border/critical/default` to map to `color/red/500` instead of `color/red/400` in dark mode
  - Changed `color/border/attention/default` to map to `color/orange/600` instead of `color/orange/500` in dark mode
  - Changed `color/border/positive/default` to map to `color/green/600` instead of `color/green/500` in dark mode
  - Changed `color/border/accent/default` to map to `color/purple/600` instead of `color/purple/500` in dark mode
  - Changed `color/text/inverse/default` to map to `color/text/primary/inverse` instead of `color/zinc/50` in light mode
  - Changed `color/text/inverse/default` to map to `color/text/primary/inverse` instead of `color/zinc/850` in dark mode
  - Changed `color/text/static/default` to map to `color/static/white` in light and dark mode
  - Changed `color/text/static/dark` to map to `color/static/black` in light and dark mode
  - Changed `color/text/brand/hover` to map to `color/brand/600` instead of `color/brand/700` in light mode
  - Changed `color/text/brand/default` to map to `color/brand/400` instead of `color/brand/500` in dark mode
  - Changed `color/text/brand/hover` to map to `color/brand/500` instead of `color/brand/700` in dark mode
  - Changed `color/text/brand/disabled` to map to `color/brand/700` instead of `color/brand/300` in dark mode
  - Changed `color/text/critical/hover` to map to `color/red/600` instead of `color/red/700` in light mode
  - Changed `color/text/critical/hover` to map to `color/red/500` instead of `color/red/700` in dark mode
  - Changed `color/text/critical/disabled` to map to `color/red/700` instead of `color/red/300` in dark mode
  - Changed `color/text/primary/default` to map to `color/zinc/50` instead of `color/zinc/100` in dark mode
  - Changed `color/text/primary/default` to map to `color/zinc/900` instead of `color/zinc/800` in light mode
  - Changed `color/text/primary/disabled` to map to `color/zinc/600` instead of `color/zinc/500` in dark mode
  - Changed `color/text/secondary/disabled` to map to `color/zinc/600` instead of `color/zinc/500` in dark mode
  - Changed `color/text/critical/dark` to map to `color/text/critical/default`
  - Fixed `color/elevation/surface/floating` to map to `color/zinc/0` instead of `#FFFFFF` in dark mode
  - Deprecated `border radius/overlay`. Please use `border radius/xs` instead.
  - Deprecated `color/interaction/secondary/dark`. Please use `color/interaction/secondary/default` for interactive elements and `color/background/tertiary/default` for non-interactive elements instead.
  - Deprecated `color/elevation/surface/selected`. There is no direct replacement.
  - Deprecated `color/elevation/surface/hover`. There is no direct replacement.
  - Deprecated `color/elevation/surface/frame`. There is no direct replacement.
  - Deprecated `color/elevation/surface/overlay`. Please use `color/elevation/surface/raised` instead.
  - Deprecated `color/elevation/surface/backdrop`. Please use `color/elevation/backdrop/default` instead.
  - Deprecated `color/elevation/surface/floating`. Please use `color/elevation/floating/default` instead.
  - Deprecated `color/background/primary/disabled`. Please use `color/background/tertiary/default` instead.
  - Deprecated `color/background/critical/dark`. Please use `color/background/critical/default` instead.
  - Deprecated `color/icon/critical/hover`. There is no direct replacement. Icons in links should use the corresponding text color.
  - Deprecated `color/icon/static/default`. Please use `color/static/white` instead.
  - Deprecated `color/icon/static/dark`. Please use `color/static/black` instead.
  - Deprecated `color/icon/inverse/default`. Please use `color/icon/primary/inverse` instead.
  - Deprecated `color/border/brand/selected`. Please use `color/border/brand/default` instead.
  - Deprecated `color/border/critical/dark`. Please use `color/border/critical/default` instead.
  - Deprecated `color/text/inverse/default`. Please use `color/text/primary/inverse` instead.
  - Deprecated `color/text/static/default`. Please use `color/static/white` instead.
  - Deprecated `color/text/static/dark`. Please use `color/static/black` instead.
  - Deprecated `color/text/tertiary/default`. Please use `color/text/secondary/default` instead.
  - Deprecated `color/text/attention/default`. There is no direct replacement.
  - Deprecated `color/text/positive/default`. There is no direct replacement.
  - Deprecated `color/text/critical/dark`. Please use `color/text/critical/default` instead.

## 1.1.0

### Minor Changes

- f4ed7d0: Add `color-border-secondary-default` token

## 1.0.0

### Major Changes

- 7abaa5a: Mark tokens as stable

## 0.3.0

### Minor Changes

- e644cef: - Removed scale/size/3
  - Removed scale/size/9
  - Removed scale/size/11
  - Removed scale/size/13
  - Removed scale/size/15
  - Removed scale/size/17
  - Removed scale/size/19
  - Removed scale/size/34
  - Removed scale/size/38
  - Removed scale/size/42
  - Removed scale/size/44
  - Removed scale/size/52
  - Removed scale/size/60
  - Removed scale/size/88
  - Removed scale/size/112
  - Removed scale/size/144
  - Removed scale/size/176
  - Removed scale/size/208
  - Removed scale/size/240
  - Added scale/size/0
  - Added border/radius/none
  - Added spacing/radius/checkbox
  - Added border/radius/button
  - Added border/radius/overlay
  - Added border/radius/card
  - Removed color/border/tertiary/default
  - Removed color/border/secondary/default

## 0.2.0

### Minor Changes

- 0a0ac80: Add color/icon/inverse token
- 0a0ac80: Add color/elevation/surface/floating token
- 0a0ac80: Add color/text/inverse token
- 0a0ac80: Add color/text/static/dark token
- 0a0ac80: Add color/icon/static/dark token

### Patch Changes

- 0a0ac80: Changed color/interactive/secondary/default to map to zinc/850 instead of zinc/800 in dark mode
- 0a0ac80: Changed color/icon/inverted to color/icon/static/default
- 0a0ac80: Changed color/interactive/secondary/hover to map to zinc/800 instead of zinc/700 in dark mode
- 0a0ac80: Changed color/text/inverted to color/text/static/default
- 0a0ac80: Changed color/interactive/secondary/hover to map to zinc/75 instead of zinc/100 in light mode

## 0.1.0

### Minor Changes

- 8443590: \* Added "color/elevation/surface/frame"
  - Changed "color/text/accent/default" to map to "purple/400" instead of "purple/050" in dark mode
  - Changed "color/elevation/surface/overlay" to map to "zinc/850" instead of "zinc/800" in dark mode
  - Changed "color/elevation/surface/sunken" to map to "zinc/975" instead of "zinc/900" in dark mode
  - Changed "color/interaction/secondary/hover" to map to "zinc/700" instead of "zinc/800" in dark mode
  - Changed "color/elevation/surface/overlay to map to "zinc/800" instead of "zinc/900" in dark mode
  - Changed "color/interactive/secondary/disabled to map to "zinc/700" instead of "zinc/600" in dark mode

## 0.0.1

### Patch Changes

- 9b6a418: Add token deliverables
