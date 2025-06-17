import { within, userEvent } from "@storybook/test";
import { expect, fn } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";
import meta, {
  type MtEntitySelectStory,
} from "./mt-entity-select.stories";

export default {
  ...meta,
  title: "Interaction Tests/Entity/mt-entity-select",
};

export const TestSingleSelection: MtEntitySelectStory = {
  name: "should select a single item",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await waitUntil(() => !!canvas.queryByText(/Manufacturer \d+/));

    // open the select
    await userEvent.click(canvas.getByRole("combobox"));

    // wait for options to appear
    await waitUntil(() => canvas.queryAllByText(/Manufacturer \d+/).length > 0);

    // click an option
    await userEvent.click(canvas.getByText("Manufacturer 2"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenCalledWith("manufacturer-2");
  },
};

export const TestMultiSelection: MtEntitySelectStory = {
  name: "should select multiple items",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await waitUntil(() => !!canvas.queryByText(/Manufacturer \d+/));

    // open the select
    await userEvent.click(canvas.getByRole("combobox"));

    // wait for options to appear
    await waitUntil(() => canvas.queryAllByText(/Manufacturer \d+/).length > 0);

    // click a few options
    await userEvent.click(canvas.getByText("Manufacturer 2"));
    await userEvent.click(canvas.getByText("Manufacturer 5"));
    await userEvent.click(canvas.getByText("Manufacturer 8"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenLastCalledWith([
      "manufacturer-2",
      "manufacturer-5",
      "manufacturer-8",
    ]);

    // remove one selection
    await userEvent.click(canvas.getByText("Manufacturer 5"));
    expect(args["onUpdate:modelValue"]).toHaveBeenLastCalledWith([
      "manufacturer-2",
      "manufacturer-8",
    ]);
  },
};

export const TestSearch: MtEntitySelectStory = {
  name: "should search for items",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await waitUntil(() => !!canvas.queryByText(/Manufacturer \d+/));

    // open the select and type a search term
    await userEvent.type(canvas.getByRole("combobox"), "Manufacturer 10");

    // wait for search results
    await waitUntil(
      () =>
        canvas.queryAllByText(/Manufacturer 10\d*/).length > 0 &&
        canvas.queryAllByText(/Manufacturer 1\d*/).length === 1
    );

    // check if only matching options are visible
    const options = canvas.getAllByRole("option");
    expect(options.every((o) => o.textContent?.includes("Manufacturer 10"))).toBe(
      true
    );
  },
};

export const TestPagination: MtEntitySelectStory = {
  name: "should paginate to load more items",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await waitUntil(() => !!canvas.queryByText(/Manufacturer \d+/));

    // open the select
    await userEvent.click(canvas.getByRole("combobox"));

    // wait for options to appear
    await waitUntil(() => canvas.queryAllByText(/Manufacturer \d+/).length > 0);

    // scroll to the bottom of the results list
    const resultsList = document.querySelector(".mt-select-result-list");
    resultsList?.scrollTo(0, resultsList.scrollHeight);

    // wait for more options to be loaded
    await waitUntil(() => canvas.queryAllByText(/Manufacturer 5\d+/).length > 0);

    // check that we have more than the initial 50 options
    const options = canvas.getAllByRole("option");
    expect(options.length).toBeGreaterThan(50);
  },
}; 