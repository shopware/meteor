import MtTabs from "./mt-tabs.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

const tabItems = [
  {
    label: "Item 1",
    name: "item1",
  },
  {
    label: "Item 2 very long",
    name: "item2",
  },
  {
    label: "Item 3",
    name: "item3",
  },
  {
    label: "Item 4 also very long",
    name: "item4",
  },
  {
    label: "Item 5",
    name: "item5",
  },
  {
    label: "Item 6",
    name: "item6",
  },
  {
    label: "Item 7",
    name: "item7",
  },
  {
    label: "Item 8 very long",
    name: "item8",
  },
  {
    label: "Item 9",
    name: "item9",
  },
  {
    label: "Item 10",
    name: "item10",
  },
  {
    label: "Item 11",
    name: "item11",
  },
  {
    label: "Item 12",
    name: "item12",
  },
  {
    label: "Item 13",
    name: "item13",
  },
  {
    label: "Item 14",
    name: "item14",
  },
  {
    label: "Item 15",
    name: "item15",
  },
  {
    label: "Item 16",
    name: "item16",
  },
  {
    label: "Item 17",
    name: "item17",
  },
];

export type MtTabsMeta = SlottedMeta<typeof MtTabs, "default">;

export default {
  title: "Components/Navigation/mt-tabs",
  component: MtTabs,
  render: (args) => ({
    components: { MtTabs },
    template: `
    <mt-tabs v-bind="args"></mt-tabs>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    vertical: false,
    small: false,
    defaultItem: "item1",
  },
} as MtTabsMeta;

export type MtTabsStory = StoryObj<typeof MtTabs>;

export const Default: MtTabsStory = {
  name: "mt-tabs",
  args: {
    items: tabItems,
    small: true,
  },
};
