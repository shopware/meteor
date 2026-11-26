import type { Meta, StoryObj } from "@storybook/vue3";
import MtGridItem from "./mt-grid-item.vue";
import MtGrid from "./mt-grid.vue";
import MtThemeProvider from "../mt-theme-provider/mt-theme-provider.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtTextarea from "../mt-textarea/mt-textarea.vue";

export type MtGridItemMeta = Meta<typeof MtGridItem>;

const meta: MtGridItemMeta = {
  title: "Components/Grid/Grid item",
  component: MtGridItem,
  render: (args) => ({
    components: { MtGridItem, MtGrid, MtThemeProvider, MtCard, MtTextField, MtTextarea },
    setup: () => ({ args }),
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Product">
    <mt-grid :columns="3">
      <mt-text-field label="Name" />
      <mt-text-field label="Product number" />
      <mt-text-field label="Manufacturer" />
      <mt-grid-item v-bind="args">
        <mt-textarea label="Description" />
      </mt-grid-item>
      <mt-text-field label="Price" />
    </mt-grid>
  </mt-card>
</mt-theme-provider>`,
  }),
};

export default meta;
export type MtGridItemStory = StoryObj<MtGridItemMeta>;

export const Default: MtGridItemStory = {
  args: {
    span: 2,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid :columns="3">
  ...
  <mt-grid-item :span="2">
    <mt-textarea label="Description" />
  </mt-grid-item>
  ...
</mt-grid>`,
      },
    },
  },
};

export const Full: MtGridItemStory = {
  name: "Full width",
  args: {
    span: "full",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid-item span="full">
  <mt-textarea label="Description" />
</mt-grid-item>`,
      },
    },
  },
};
