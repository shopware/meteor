import MtPagination from "./mt-pagination.vue";
import { action } from "@storybook/addon-actions";
import { type SlottedMeta, defineStory } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

export default {
  title: "Components/Table and list/mt-pagination",
  component: MtPagination,
} satisfies SlottedMeta<typeof MtPagination, "default">;

export const Default = defineStory<typeof MtPagination>({
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
});
