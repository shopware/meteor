import { fn, userEvent, expect } from "@storybook/test";
import meta, { type MtDataTableFilterMeta } from "./mt-data-table-filter.stories";
import { defineStory } from "@/_internal/story-helper";
import MtDataTableFilter from "./mt-data-table-filter.vue";

export default {
  ...meta,
  title: "Interaction Tests/Table and List/mt-data-table-filter",
} as MtDataTableFilterMeta;

export const FocusOption = defineStory<typeof MtDataTableFilter>({
  name: "Opens the filter edit menu",
  async play({ screen }) {
    await userEvent.click(screen.getByRole("button", { name: "Option 1" }));
  },
});

export const FocusCloseButton = defineStory<typeof MtDataTableFilter>({
  name: "Clicks the close button",
  args: {
    onRemoveFilter: fn(),
  },
  async play({ screen, args }) {
    await userEvent.click(screen.getByRole("button", { name: "Remove filter" }));

    expect(args?.onRemoveFilter).toHaveBeenCalledOnce();
  },
});
