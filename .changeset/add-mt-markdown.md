---
"@shopware-ag/meteor-component-library": minor
---

Add the experimental `MtMarkdown`, which renders Markdown such as an AI answer safely, also while it is still streaming. Raw HTML shows as text, links only use safe schemes, images only load from `allowedImagePrefixes`, and code blocks have a copy button. It builds on Comark and adds `@comark/vue` as a dependency.
