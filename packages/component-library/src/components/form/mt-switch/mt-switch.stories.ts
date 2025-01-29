import MtSwitch from "./mt-switch.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtSwitchMeta = SlottedMeta<typeof MtSwitch, "default">;

export default {
  title: "Components/Form/mt-switch",
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

export const DefaultStory: MtSwitchStory = {
  name: "mt-switch",
};
