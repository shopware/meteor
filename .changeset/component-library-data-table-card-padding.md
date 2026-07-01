---
"@shopware-ag/meteor-component-library": patch
---

Fixed the `mt-data-table` card content keeping its default padding in some bundling setups. The reset that removes the padding tied on specificity with the card's own scoped style and could lose depending on stylesheet order. The selector is now more specific so the table content reliably has no padding.
