import type { StoryObj } from "@storybook/vue3";
import MtDataTableFilter from "./mt-data-table-filter.vue";
import { action } from "@storybook/addon-actions";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtDataTableFilterMeta = SlottedMeta<
  typeof MtDataTableFilter,
  "addOption" | "removeOption" | "removeFilter"
>;

export default {
  title: "Components/Table and list/mt-data-table/sub-components/mt-data-table-filter",
  component: MtDataTableFilter,
  render: (args) => ({
    components: { MtDataTableFilter },
    setup() {
      return { args };
    },
    template:
      '<mt-data-table-filter @remove-option="args.removeOption" @add-option="args.addOption" v-bind="args" />',
  }),
  args: {
    addOption: action("addOption"),
    removeOption: action("removeOption"),
    removeFilter: action("removeFilter"),
    filter: {
      id: "filter",
      label: "Filter",
      type: {
        id: "options",
        options: [
          {
            id: "option-1",
            label: "Option 1",
          },
          {
            id: "option-2",
            label: "Option 2",
          },
        ],
      },
    },
    appliedOptions: [
      {
        id: "option-1",
        label: "Option 1",
      },
    ],
  },
} satisfies MtDataTableFilterMeta;

export type MtDataTableFilterStory = StoryObj<MtDataTableFilterMeta>;

export const Default: MtDataTableFilterStory = {};
