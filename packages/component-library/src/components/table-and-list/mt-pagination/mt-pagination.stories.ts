import MtPagination from "./mt-pagination.vue";
import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import type { SlottedMeta } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

export type MtPaginationMeta = SlottedMeta<typeof MtPagination, "default">;

const meta: MtPaginationMeta = {
  title: "Components/Table and list/mt-pagination",
  component: MtPagination,
};

export default meta;
export type MtPaginationStory = StoryObj<typeof MtPagination>;

export const Default: MtPaginationStory = {
  render: (args) => ({
    components: { MtPagination },
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
    template: `<mt-pagination v-bind="args" :current-page="page" @change-current-page="onChangeCurrentPage" />`,
  }),

  args: {
    totalItems: 100,
    limit: 25,
  },

  name: "mt-pagination",
};
