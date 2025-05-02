import type { StoryObj } from "@storybook/vue3";
import MtGrid from "./mt-grid.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextField from "@/components/form/mt-text-field/mt-text-field.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtFutureFlag from "@/components/theme/mt-future-flag.vue";
import MtSwitch from "@/components/form/mt-switch/mt-switch.vue";

type MtGridMeta = SlottedMeta<typeof MtGrid, "default">;

export default {
  title: "Components/Layout/mt-grid",
  component: MtGrid,
  render(args) {
    return {
      setup: () => ({ args }),
      components: { MtGrid, MtTextField, MtCard, MtFutureFlag, MtSwitch },
      template: `
<mt-future-flag remove-default-margin>
  <mt-card title="Grid inside a card">
    <mt-grid v-bind="args">
      <MtTextField label="Delivery time" />
      <MtTextField label="Restock time in days" />
      <MtSwitch label="Free shipping" />
      <MtTextField label="Min. order quantity" />
      <MtTextField label="Purchase steps" />
      <MtTextField label="Max. order quantity" />
    </mt-grid>
  </mt-card>
</mt-future-flag>
`,
    };
  },
} satisfies MtGridMeta;

export const Default: StoryObj<MtGridMeta> = {
  args: {
    columns: 3,
  },
};
