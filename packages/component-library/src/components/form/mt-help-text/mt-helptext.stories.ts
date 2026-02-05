import { defineStory } from "@/_internal/story-helper";
import MtHelpText from "./mt-help-text.vue";
import type { Meta } from "@storybook/vue3";

type MtHelpTextMeta = Meta<typeof MtHelpText>;

export default {
  title: "Components/Form/mt-help-text",
  component: MtHelpText,
  args: {
    text: "Help text",
  },
  parameters: {
    docs: {
      description: {
        component: `A small help icon that displays explanatory text in a tooltip on hover. Use it to provide contextual guidance without cluttering the UI.

## Usage

\`\`\`html
<mt-help-text text="This field is required for checkout" />
\`\`\`

## ✅ Do's
- Use for brief, supplementary explanations
- Place near the element it describes (e.g. next to a label)

## ❌ Don'ts
- Don't use for critical information users must see
- Don't put lengthy content in the tooltip`,
      },
    },
  },
} as MtHelpTextMeta;

export const Default = defineStory({});
