<script setup lang="ts">
import { MtMarkdown } from "@shopware-ag/meteor-component-library";

const answer = `## Low stock

Three products are below a stock of 5. The **linen cushion** is sold out.

| Product | Number | Stock |
| :-- | :-- | --: |
| Desk lamp, brass | SW-1000 | 2 |
| Linen cushion | SW-1012 | 0 |
| Ceramic vase | SW-1025 | 4 |

### Next steps

1. Reorder the cushion from the supplier.
2. Raise the stock once the delivery arrives:

\`\`\`sh
curl -X PATCH https://shop.example.com/api/product/SW-1012 -d '{ "stock": 40 }'
\`\`\`

See the [stock documentation](https://docs.shopware.com) for details.`;
</script>

<template>
  <mt-markdown :content="answer" />
</template>
