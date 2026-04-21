import MtSwitch from "./mt-switch.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtSwitchMeta = SlottedMeta<typeof MtSwitch, "default">;

export default {
  title: "Components/mt-switch",
  component: MtSwitch,
  args: {
    label: "Switchfield",
    onChange: fn(),
    "onUpdate:modelValue": fn(),
    "onInheritance-remove": fn(),
    "onInheritance-restore": fn(),
  },
} as MtSwitchMeta;

export type MtSwitchStory = StoryObj<MtSwitchMeta>;

export const Default: MtSwitchStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-switch
  v-model="enabled"
  label="Switchfield"
/>`,
      },
    },
  },
};

export const States: MtSwitchStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-switch :model-value="false" label="Off" />
<mt-switch :model-value="true" label="On" />
<mt-switch :model-value="true" label="Disabled" :disabled="true" />`,
      },
    },
  },
  render: () => ({
    components: { MtSwitch },
    template: `
      <div style="display: grid; gap: 12px;">
        <mt-switch :model-value="false" label="Off" />
        <mt-switch :model-value="true" label="On" />
        <mt-switch :model-value="true" label="Disabled" :disabled="true" />
      </div>`,
  }),
};
