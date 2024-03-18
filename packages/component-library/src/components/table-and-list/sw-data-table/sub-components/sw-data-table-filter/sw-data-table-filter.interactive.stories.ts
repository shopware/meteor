import { userEvent } from "@storybook/testing-library";
import meta, {
  type SwDataTableFilterMeta,
  type SwDataTableFilterStory,
} from "./sw-data-table-filter.stories";

export default {
  ...meta,
  title: "Interaction Tests/Table and List/sw-data-table-filter",
} as SwDataTableFilterMeta;

export const FocusCategory: SwDataTableFilterStory = {
  name: "Should focus category",
  async play() {
    await userEvent.tab();

    // TODO: test that clicking the things will emit the correct events
  },
};

export const FocusOption: SwDataTableFilterStory = {
  name: "Should focus filter option",
  async play() {
    await userEvent.tab();
    await userEvent.tab();

    // TODO: test that clicking the things will emit the correct events
  },
};

export const FocusCloseButton: SwDataTableFilterStory = {
  name: "Should focus close button",
  async play() {
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await userEvent.keyboard("{enter}");

    // TODO: test that clicking the things will emit the correct events
  },
};
