# Things noticed

Open points from prototyping the new color palettes. The token decisions are in `mapping.mjs`.

Issue → recommended change.

## Palettes

1. **Neutral 200 and 300 don't fit `border-secondary` in the light theme.** 100 → 200 is ΔL 0.017, 200 → 300 is 0.036: 200 sits too close to 100.
   → Darken neutral 200 to about #E9EAEB (L 0.937). That evens the curve, makes hover and `background-tertiary` more visible, and leaves 300 (`border-primary`) as it is.
2. **The dark app background needs a half step (1850)** between 1800 (default surface) and 1900.
   → Lighten neutral 1900 to about #070707 and use 1900 for `elevation-surface-sunken`. 1900 is otherwise only used as "almost black" (static black, base of backdrop and shadow).
3. **Green is darker at the dark end** than the other palettes (L 0.29 vs. 0.34 at 1400), so positive banners and badges look dull.
   → Raise green's `lightnessOffset` from −0.08 to about −0.03, in line with the other palettes. Recheck green 1000 against white afterwards (6.14:1 today).
4. **Red and orange look the same in the dark tints.** At 1400, orange has hue 37 and chroma 0.066, red hue 28 and chroma 0.079; orange drifts toward red at the dark end (hue 46 at 1000).
   → Raise orange's hue in the generator (about 64 → 70) or reduce its drift at the dark end, so orange 1400 stays at hue 45 or more.

## Tokens

5. **No strong status backgrounds** ([#1507](https://github.com/shopware/meteor/issues/1507)).
   → Remove the strong appearance of `mt-announcement` (see 7) and narrow #1507 to the places that still need a strong background, such as `mt-brand` and the marker of `mt-nav`.

## Components

6. **`mt-action-menu` uses `elevation-surface-default`**, though the Elevation docs put dropdowns on `raised`. With distinct surfaces it turns grey in light and darker than cards in dark.
   → Use `elevation-surface-raised`.
7. **`mt-announcement` has a strong appearance.**
   → Remove `strong` (TODO in the component). Subtle uses the status backgrounds, with a bottom border one step stronger than the tint (300 / 1300).
8. **`mt-switch` uses `interaction-secondary-disabled` for the unchecked track**, though the switch isn't disabled; with the muted disabled token the track disappears on cards.
   → Use `border-primary-default` for the track.
9. **Banners and badges have borders.**
   → Remove the border; the status background (200 / 1400) is enough. Neutral needs a tint: neutral 200 / 1400, or a token for it.
10. **Links in banners** reach about 4.15:1 in light and 3.6 to 3.9:1 in dark.
    → Text color with an underline, like in `mt-announcement`. The contrast mode of the prototype does this already.
11. **Form controls are below 3:1** (WCAG 1.4.11): `border-primary` is 1.27:1 on white and 1.45:1 on dark cards. A dedicated `border-control-default` at neutral 800 / 1000 (3.47:1 / 3.40:1) was tested in the prototype and looked far too dark.
    → Keep the default mode light, and offer a contrast mode that raises `border-primary` to neutral 800 / 1000 (3.47:1 on white, 3.40:1 on dark cards, 3.11:1 on dark inputs). The prototype has it as "New + contrast".
12. **Cards and the `mt-app` frames get their edges from overrides.**
    → Add an `elevation-shadow-raised` token: in light, the 0.5px ring with drop and contact shadow; in dark, a light 10 % ring with a dark shadow. `mt-card` uses it in both themes, the `mt-app` frames in light, and `border-secondary` in dark.
13. **In `mt-nav`, the hover marker has the same color as the guide lines** (`border-primary`).
    → Guide lines on `border-primary`, hover marker on `icon-secondary-default`.
14. **`mt-data-table` in dark:** the header and the alternating rows use `sunken` and look heavy on cards.
    → Use `background-secondary`.

## Process

15. **Migration guide** for old → new primitives.
    → Write it after the palette changes, from the rules in `mapping.mjs`: status colors 500 → 1000 in light and 800 in dark, zinc → neutral by lightness.
16. **Regenerate** after the palette changes.
    → Re-export the palettes and run `node proto-colors/generate.mjs` again.
