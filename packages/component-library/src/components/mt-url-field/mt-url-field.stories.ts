import MtUrlField from "./mt-url-field.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

export type MtUrlFieldMeta = Meta<typeof MtUrlField>;

export default {
  title: "Components/URL Field",
  component: MtUrlField,
  render: (args) => ({
    components: { MtUrlField },
    setup: () => ({ args }),
    template: `
<mt-url-field v-bind="args">
  <template v-if="args.prefix" #prefix>
    {{ args.prefix }}
  </template>

  <template v-if="args.suffix" #suffix>
    {{ args.suffix }}
  </template>

  <template v-if="args.hint" #hint>
    {{ args.hint }}
  </template>
</mt-url-field>`,
  }),
  args: {
    modelValue: "https://shopware.com",
    label: "Url field",
    size: "default",
  },
} as MtUrlFieldMeta;

export type MtUrlFieldStory = StoryObj<typeof MtUrlField>;

export const Default: MtUrlFieldStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-url-field
  v-model="url"
  label="Website"
/>`,
      },
    },
  },
};
