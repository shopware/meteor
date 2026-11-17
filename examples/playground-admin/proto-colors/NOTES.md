# Notes on the new color palettes

Open points found while testing the prototype in this playground. They feed into the palettes, the
token mapping and the migration guide.

## Palettes

- **Neutral, light theme:** for `border-secondary-default`, neutral 200 is too light and neutral 300
  too dark. The palette needs a step in between. The prototype uses 200 for now.
- **Green, dark theme:** the dark steps of green are darker and less colorful than the other
  palettes (`lightnessOffset: -0.08`, `chromaScale: 0.7`). At 1400 its lightness is L 0.29, the
  others are at 0.32 to 0.34, so positive badges and banners look darker.

## Contrast

- **Brand 1000 on brand 200** is 4.17:1. Accepted as a known exception of the main brand color.
- **`border-primary-default`** on surfaces is below 3:1 (1.22:1 light, 1.55:1 dark), as it was with
  the old palettes.
- **Links in banners:** brand 1000 on the light tints (200) is about 4.15:1, brand 800 on the dark
  tints (1400) 3.6 to 3.9:1. Links in banners could take the text color, like in `mt-announcement`.

## Components

- **`mt-action-menu`** uses `elevation-surface-default`, but the Elevation docs put dropdowns and
  popovers on `elevation-surface-raised`. With distinct default and raised surfaces, the menu turns
  grey in the light theme and darker than cards in the dark theme. The prototype overrides it to
  raised.
- **`mt-switch`** uses `interaction-secondary-disabled` for the track of an unchecked switch, though
  the switch isn't disabled. Once the disabled token is muted for buttons, the track disappears on
  cards. The prototype uses `border-primary-default` for the track; the component needs its
  own token or another existing one.
- **`mt-announcement`:** remove the `strong` appearance. Announcements get the tinted look of
  banners only (TODO in the component).

## Half steps

- **Dark app background:** `elevation-surface-sunken` uses 1850, mixed halfway between 1800 and 1900,
  because neither step fits. It came from a variant close to Linear's colors. If it stays, the dark
  end of the neutral palette needs finer steps.
