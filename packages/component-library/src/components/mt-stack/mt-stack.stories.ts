import type { Meta, StoryObj } from "@storybook/vue3";
import MtStack from "./mt-stack.vue";
import MtThemeProvider from "../mt-theme-provider/mt-theme-provider.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtSwitch from "../mt-switch/mt-switch.vue";
import MtCheckbox from "../mt-checkbox/mt-checkbox.vue";
import MtButton from "../mt-button/mt-button.vue";

export type MtStackMeta = Meta<typeof MtStack>;

const sharedComponents = {
  MtStack,
  MtThemeProvider,
  MtCard,
  MtTextField,
  MtSwitch,
  MtCheckbox,
  MtButton,
};

const meta: MtStackMeta = {
  title: "Components/Stack",
  component: MtStack,
  render: (args) => ({
    components: sharedComponents,
    setup: () => ({ args }),
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Address">
    <mt-stack v-bind="args">
      <mt-text-field label="Street" />
      <mt-text-field label="City" />
      <mt-text-field label="Country" />
    </mt-stack>
  </mt-card>
</mt-theme-provider>`,
  }),
};

export default meta;
export type MtStackStory = StoryObj<MtStackMeta>;

export const Default: MtStackStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stack>
  <mt-text-field label="Street" />
  <mt-text-field label="City" />
  <mt-text-field label="Country" />
</mt-stack>`,
      },
    },
  },
};

export const SwitchList: MtStackStory = {
  name: "Switch list",
  render: () => ({
    components: sharedComponents,
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Options">
    <mt-stack gap="scale-size-16">
      <mt-switch label="Active" bordered />
      <mt-switch label="Show in navigation" bordered />
      <mt-switch label="Allow reviews" bordered />
    </mt-stack>
  </mt-card>
</mt-theme-provider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stack gap="scale-size-16">
  <mt-switch label="Active" bordered />
  <mt-switch label="Show in navigation" bordered />
  <mt-switch label="Allow reviews" bordered />
</mt-stack>`,
      },
    },
  },
};

export const CheckboxList: MtStackStory = {
  name: "Checkbox list",
  render: () => ({
    components: sharedComponents,
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Notifications">
    <mt-stack gap="scale-size-8">
      <mt-checkbox label="Order placed" />
      <mt-checkbox label="Order shipped" />
      <mt-checkbox label="Order cancelled" />
    </mt-stack>
  </mt-card>
</mt-theme-provider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stack gap="scale-size-8">
  <mt-checkbox label="Order placed" />
  <mt-checkbox label="Order shipped" />
  <mt-checkbox label="Order cancelled" />
</mt-stack>`,
      },
    },
  },
};

export const JustifyEnd: MtStackStory = {
  name: "Right-aligned actions",
  render: () => ({
    components: sharedComponents,
    template: `
<mt-theme-provider :future="{ removeDefaultMargin: true }">
  <mt-card title="Shipping">
    <mt-stack>
      <mt-text-field label="Delivery time" />
      <mt-stack direction="horizontal" gap="scale-size-8" justify="end">
        <mt-button variant="secondary">Cancel</mt-button>
        <mt-button variant="primary">Save</mt-button>
      </mt-stack>
    </mt-stack>
  </mt-card>
</mt-theme-provider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stack direction="horizontal" gap="scale-size-8" justify="end">
  <mt-button variant="secondary">Cancel</mt-button>
  <mt-button variant="primary">Save</mt-button>
</mt-stack>`,
      },
    },
  },
};

export const Horizontal: MtStackStory = {
  render: () => ({
    components: sharedComponents,
    template: `
<mt-stack direction="horizontal" gap="scale-size-8" align="center">
  <mt-button variant="secondary">Cancel</mt-button>
  <mt-button variant="primary">Save</mt-button>
</mt-stack>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stack direction="horizontal" gap="scale-size-8" align="center">
  <mt-button variant="secondary">Cancel</mt-button>
  <mt-button variant="primary">Save</mt-button>
</mt-stack>`,
      },
    },
  },
};
