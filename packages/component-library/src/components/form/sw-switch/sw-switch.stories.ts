import SwSwitch from "./sw-switch.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwSwitchMeta = SlottedMeta<
  typeof SwSwitch,
  "default" | "error" | "inheritanceRemove" | "change" | "label"
>;

export default {
  title: "Components/Form/sw-switch",
  component: SwSwitch,
  render: (args) => ({
    components: { SwSwitch },
    template: `
      <sw-switch
        v-bind="args"
        @change="args.change"
        @inheritance-remove="args.inheritanceRemove"
      ></sw-switch>`,
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
  },
} as SwSwitchMeta;

export type SwSwitchStory = StoryObj<SwSwitchMeta>;

export const DefaultStory: SwSwitchStory = {
  name: "sw-switch",
};
