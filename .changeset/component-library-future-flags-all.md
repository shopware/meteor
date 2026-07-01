---
"@shopware-ag/meteor-component-library": minor
---

Added a way to enable every future flag at once and introduced two new flags. The Theme Provider `future` prop now accepts `"all"` (or `true`) to turn on all current and future flags, so flags added in later releases are opted into automatically. The object form still works and can be combined with `all`, for example `{ all: true, removeCardWidth: false }` to enable everything except a single flag.

New flags:

- `removeSwitchMinHeight`: removes the minimum height from a non-bordered `mt-switch`.
- `bannerFullWidth`: makes `mt-banner` span the full width of its container.

All flags remain `false` by default, so behavior is unchanged until you opt in.
