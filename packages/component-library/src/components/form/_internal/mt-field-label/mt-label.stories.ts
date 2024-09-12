import type { SlottedMeta } from "@/_internal/story-helper";
import MtFieldLabel from "./mt-field-label.vue";
import type { StoryObj } from "@storybook/vue3";

export type MtFieldLabelMeta = SlottedMeta<typeof MtFieldLabel, "default">;

export default {
  title: "Components/Form/mt-field-label",
  args: {
    label: "Label",
    required: false,
    inheritance: null,
    hasError: false,
    id: "some-id",
  },
  render: (args) => ({
    components: { MtFieldLabel },
    setup() {
      return {
        args,
      };
    },
    template: `<mt-field-label v-bind="args">{{ args.default }}</mt-field-label>`,
  }),
} satisfies MtFieldLabelMeta;

export type MtFieldLabelStory = StoryObj<MtFieldLabelMeta>;

export const Default: MtFieldLabelStory = {};
