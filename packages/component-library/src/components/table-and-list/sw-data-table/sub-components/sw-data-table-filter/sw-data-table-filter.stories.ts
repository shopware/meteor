import type { Meta, StoryObj } from "@storybook/vue3";
import SwDataTableFilter from "./sw-data-table-filter.vue";
import { action } from "@storybook/addon-actions";

export type SwDataTableFilterMeta = Meta<typeof SwDataTableFilter>;

export default {
  title: "Components/Table and list/sw-data-table/sub-components/sw-data-table-filter",
  component: SwDataTableFilter,
  render: (args) => ({
    components: { SwDataTableFilter },
    setup() {
      return { args };
    },
    template: '<sw-data-table-filter @remove="args.remove" v-bind="args" />',
  }),
  args: {
    remove: action("remove"),
    property: "Status",
    option: "Active",
  },
} satisfies SwDataTableFilterMeta;

export type SwDataTableFilterStory = StoryObj<SwDataTableFilterMeta>;

export const Default: SwDataTableFilterStory = {};
