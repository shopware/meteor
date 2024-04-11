import { fn, userEvent, expect, within } from "@storybook/test";
import meta, {
  type MtDataTableFilterMeta,
  type MtDataTableFilterStory,
} from "./mt-data-table-filter.stories";

export default {
  ...meta,
  title: "Interaction Tests/Table and List/mt-data-table-filter",
} as MtDataTableFilterMeta;

export const FocusOption: MtDataTableFilterStory = {
  name: "Opens the filter edit menu",
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Option 1" }));
  },
};

export const FocusCloseButton: MtDataTableFilterStory = {
  name: "Clicks the close button",
  args: {
    onRemoveFilter: fn(),
  },
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Remove filter" }));

    expect(args.onRemoveFilter).toHaveBeenCalledOnce();
  },
};
