---
"@shopware-ag/meteor-component-library": minor
---

Add `MtMarkdown`, which renders Markdown such as an AI answer, and the `mt-prose` class, which styles plain HTML such as rendered Markdown. Both are experimental: their API may still change in a future release.

- `MtMarkdown` renders Markdown, such as an AI answer, including GitHub's tables, task lists, strikethrough and bare links, in the `mt-prose` styles. With `streaming`, only what already renders as in the finished text shows, so raw Markdown never flashes: syntax without content yet waits for it, unfinished emphasis renders as if it were complete, tables appear with their header and first row and then row by row, and finished blocks don't render again while the text grows. Raw HTML shows as text, links only use `http`, `https`, `mailto` and `tel`, and images only load from `allowedImagePrefixes`. Code blocks have a copy button. It adds `marked` and `remend` as dependencies.
- The `mt-prose` class styles plain HTML such as rendered Markdown with Meteor's typography at 14px and spacing modeled on GitHub's Markdown styles; `mt-not-prose` leaves an element inside it unstyled.
