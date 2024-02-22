import SwPagination from "./sw-pagination.vue";
import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import type { SlottedMeta } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

const meta: SlottedMeta<typeof SwPagination, "default"> = {
  title: "Components/Table and list/sw-pagination",
  component: SwPagination,
};

export default meta;
type Story = StoryObj<typeof SwPagination>;

export const Default: Story = {
  render: (args) => ({
    components: { SwPagination },
    setup: () => {
      const page = ref(1);

      return {
        page,
        onChangeCurrentPage: ($event: number) => {
          fn(action("change-current-page"))($event);
          page.value = $event;
        },
        args,
      };
    },
    template: `<sw-pagination v-bind="args" :current-page="page" @change-current-page="onChangeCurrentPage" />`,
  }),

  args: {
    totalItems: 100,
    limit: 25,
  },

  name: "sw-pagination",
};
