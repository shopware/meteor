import type { Meta, StoryObj } from "@storybook/vue3";
import MtGrid from "./mt-grid.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextField from "@/components/form/mt-text-field/mt-text-field.vue";

type MtGridMeta = SlottedMeta<typeof MtGrid, "default">;

export default {
  title: "Components/Layout/MtGrid",
  component: MtGrid,
  render(args) {
    return {
      setup: () => ({ args }),
      components: { MtGrid, MtTextField },
      template: `
<mt-grid v-bind="args">
  <MtTextField label="Item 1" />
  <MtTextField label="Item 1" />
  <MtTextField label="Item 1" />
  <MtTextField label="Item 1" />
</mt-grid>`,
    };
  },
} satisfies MtGridMeta;

export const Default: StoryObj<MtGridMeta> = {};
