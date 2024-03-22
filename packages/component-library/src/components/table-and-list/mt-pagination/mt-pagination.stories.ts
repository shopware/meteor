import MtPagination from "./mt-pagination.vue";
import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import type { SlottedMeta } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

const meta: SlottedMeta<typeof MtPagination, "default"> = {
  title: "Components/Table and list/mt-pagination",
  component: MtPagination,
};

export default meta;
type Story = StoryObj<typeof MtPagination>;

export const Default: Story = {
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
