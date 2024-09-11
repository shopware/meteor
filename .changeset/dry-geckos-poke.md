---
"@shopware-ag/meteor-component-library": major
---

Removed large width of card

The large size of the card has been removed. Container sizes
like this should be defined by the parent element.

To migrate, add a max-width of `83.125rem` to the parent element.
