import MtUrlField from "./mt-url-field.vue";
import { hintArgTypes } from "../_internal/form-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtUrlFieldMeta = SlottedMeta<
  typeof MtUrlField,
  "default" | "prefix" | "suffix" | "hint" | "hintSlot"
>;

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

  <template v-if="args.hintSlot" #hint>
    {{ args.hintSlot }}
  </template>
</mt-url-field>`,
  }),
  argTypes: {
    ...hintArgTypes,
  },
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
