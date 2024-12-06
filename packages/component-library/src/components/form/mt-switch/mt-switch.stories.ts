import MtSwitch from "./mt-switch.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtSwitchMeta = SlottedMeta<
  typeof MtSwitch,
  "default" | "error" | "inheritanceRemove" | "change" | "label"
>;

export default {
  title: "Components/Form/mt-switch",
  component: MtSwitch,
  render: (args) => ({
    components: { MtSwitch },
    template: `
      <mt-switch
        v-bind="args"
        @change="args.change"
        @inheritance-remove="args.inheritanceRemove"
      ></mt-switch>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
  argTypes: {
    change: {
      action: "change",
      table: {
        category: "Events",
      },
    },
    "inheritance-restore": {
      action: "inheritance-restore",
      table: {
        category: "Events",
      },
    },
    inheritanceRemove: {
      action: "inheritance-remove",
      table: {
        category: "Events",
      },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    label: "Switchfield",
    change: fn(),
    inheritanceRemove: fn(),
  },
} as MtSwitchMeta;

export type MtSwitchStory = StoryObj<MtSwitchMeta>;

export const DefaultStory: MtSwitchStory = {
  name: "mt-switch",
};
