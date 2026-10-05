import type { Meta, StoryObj } from "@storybook/vue3";
import MtMarkdown from "./mt-markdown.vue";

export type MtMarkdownMeta = Meta<typeof MtMarkdown>;

/** Every element that `mt-markdown` renders, in the order of a typical answer. */
const kitchenSink = `# Stock report

Two products are **low on stock**, and one is *sold out*. The numbers come from the \`stock\` field
of each product and were ~~estimated~~ counted this morning.

## Products to reorder

| Product | Number | Stock | Price |
| :-- | :-- | --: | --: |
| Desk lamp, brass | SW-1000 | 2 | €89.00 |
| Linen cushion<br>Sand | SW-1012 | 0 | €34.90 |
| Ceramic vase | SW-1025 | 4 | €49.00 |

### Next steps

1. Reorder the cushion from the supplier.
2. Check the open orders:
   - Orders that include the cushion
   - Orders that are paid but not shipped
3. Update the stock.

- [x] Count the warehouse
- [ ] Send the purchase order

> Products below a stock of 5 show as "Only a few left" in the storefront.

#### Update the stock with the API

\`\`\`sh
curl -X PATCH https://shop.example.com/api/product/SW-1012 \\
  -H "Content-Type: application/json" \\
  -d '{ "stock": 40 }'
\`\`\`

---

##### Sources

###### Last checked today

See the [stock documentation](https://docs.example.com/stock) or open the [products](/products).`;

const meta: MtMarkdownMeta = {
  title: "Components/Markdown",
  component: MtMarkdown,
  args: {
    content: kitchenSink,
  },
  render: (args) => ({
    components: { MtMarkdown },
    setup: () => ({ args }),
    template: `<div style="max-width: 40rem"><mt-markdown v-bind="args" /></div>`,
  }),
};

export default meta;
export type MtMarkdownStory = StoryObj<MtMarkdownMeta>;

export const Default: MtMarkdownStory = {};

/**
 * An answer that is still arriving. The unfinished emphasis at the end already renders bold, as it
 * will once the closing `**` arrives.
 */
export const Streaming: MtMarkdownStory = {
  args: {
    streaming: true,
    content: `## Stock

Two products are low on stock, and the linen cushion is **sold`,
  },
};

/** A code block that is still being written has no copy button yet. */
export const StreamingCode: MtMarkdownStory = {
  args: {
    streaming: true,
    content: `Update the stock with the API:

\`\`\`sh
curl -X PATCH https://shop.example.com/api/product/SW-1012`,
  },
};
