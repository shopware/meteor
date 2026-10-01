import type { Meta, StoryObj } from "@storybook/vue3";
import MtGrid from "./mt-grid.vue";
import MtGridItem from "./mt-grid-item.vue";
import MtThemeProvider from "../mt-theme-provider/mt-theme-provider.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtNumberField from "../mt-number-field/mt-number-field.vue";
import MtSelect from "../mt-select/mt-select.vue";
import MtSwitch from "../mt-switch/mt-switch.vue";
import MtTextarea from "../mt-textarea/mt-textarea.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtDivider from "../mt-divider/mt-divider.vue";

export type MtGridMeta = Meta<typeof MtGrid>;

const sharedComponents = {
  MtGrid,
  MtGridItem,
  MtThemeProvider,
  MtCard,
  MtTextField,
  MtNumberField,
  MtSelect,
  MtSwitch,
  MtTextarea,
  MtButton,
  MtDivider,
};

const meta: MtGridMeta = {
  title: "Components/Grid",
  component: MtGrid,
  render: (args) => ({
    components: sharedComponents,
    setup: () => ({ args }),
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Shipping">
    <mt-grid v-bind="args">
      <mt-text-field label="Delivery time" />
      <mt-number-field label="Restock time in days" />
      <mt-text-field label="Minimum order quantity" />
      <mt-text-field label="Purchase steps" />
      <mt-text-field label="Maximum order quantity" />
      <mt-switch label="Free shipping" bordered />
    </mt-grid>
  </mt-card>
</mt-theme-provider>`,
  }),
};

export default meta;
export type MtGridStory = StoryObj<MtGridMeta>;

export const Default: MtGridStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid>
  <mt-text-field label="Delivery time" />
  <mt-number-field label="Restock time in days" />
  <mt-text-field label="Minimum order quantity" />
  <mt-text-field label="Purchase steps" />
  <mt-text-field label="Maximum order quantity" />
  <mt-switch label="Free shipping" bordered />
</mt-grid>`,
      },
    },
  },
};

export const ThreeColumns: MtGridStory = {
  name: "Three columns",
  args: {
    columns: 3,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid :columns="3">
  ...
</mt-grid>`,
      },
    },
  },
};

export const FullWidthItem: MtGridStory = {
  name: "Full-width item",
  render: () => ({
    components: sharedComponents,
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Product">
    <mt-grid>
      <mt-text-field label="Name" />
      <mt-text-field label="Product number" />
      <mt-grid-item span="full">
        <mt-textarea label="Description" />
      </mt-grid-item>
      <mt-grid-item span="full">
        <mt-divider />
      </mt-grid-item>
      <mt-number-field label="Price" />
      <mt-number-field label="Tax rate" />
    </mt-grid>
  </mt-card>
</mt-theme-provider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid>
  <mt-text-field label="Name" />
  <mt-text-field label="Product number" />
  <mt-grid-item span="full">
    <mt-textarea label="Description" />
  </mt-grid-item>
  <mt-grid-item span="full">
    <mt-divider />
  </mt-grid-item>
  <mt-number-field label="Price" />
  <mt-number-field label="Tax rate" />
</mt-grid>`,
      },
    },
  },
};

export const CustomTemplate: MtGridStory = {
  name: "Custom column template",
  render: () => ({
    components: sharedComponents,
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Access key">
    <mt-grid columns="1fr auto">
      <mt-text-field label="API access key" model-value="SWSC3VJ4S3O3MHAZ" disabled />
      <mt-button variant="secondary">Generate new</mt-button>
    </mt-grid>
  </mt-card>
</mt-theme-provider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid columns="1fr auto">
  <mt-text-field label="API access key" />
  <mt-button variant="secondary">Generate new</mt-button>
</mt-grid>`,
      },
    },
  },
};

export const CustomGap: MtGridStory = {
  name: "Custom gap",
  args: {
    rowGap: "scale-size-16",
    columnGap: "scale-size-24",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid row-gap="scale-size-16" column-gap="scale-size-24">
  ...
</mt-grid>`,
      },
    },
  },
};

export const StartAligned: MtGridStory = {
  name: "Start-aligned items",
  args: {
    align: "start",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-grid align="start">
  ...
</mt-grid>`,
      },
    },
  },
};
