---
"@shopware-ag/meteor-component-library": major
---

Removed default typograhpy styling of card children

To migrate you can use the `<mt-text />` component for text content
that is inside your card.

For `p` tags you can simply use `<mt-text>My text</mt-text>`

If you have headlines in your card you can change which tag the
component will render like this:

```
<mt-text as="h3" size="m">My headline</mt-text>
```
