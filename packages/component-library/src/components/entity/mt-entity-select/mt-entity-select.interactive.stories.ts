import { within, userEvent } from "@storybook/test";
import { expect, fn } from "@storybook/test";
import { screen } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";
import meta, { type MtEntitySelectStory } from "./mt-entity-select.stories";

export default {
  ...meta,
  title: "Interaction Tests/Entity/mt-entity-select",
};

export const VisualTestSingleSelection: MtEntitySelectStory = {
  name: "should select a single item",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await canvas.findByText("Manufacturers");

    // open the select by clicking on text input
    await canvas.getByRole("textbox").click();

    // wait for options to appear
    await screen.findByText("Manufacturer 2 with a long name to test wrapping");

    // click an option
    await userEvent.click(screen.getByText("Manufacturer 2 with a long name to test wrapping"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenCalledWith("manufacturer-2");
  },
};

export const VisualTestMultiSelection: MtEntitySelectStory = {
  name: "should select multiple items",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await canvas.findByText("Manufacturers");

    // open the select by clicking on text input
    await canvas.getByRole("textbox").click();

    // wait for options to appear
    await screen.findByText("Manufacturer 2 with a long name to test wrapping");

    // click a few options
    await userEvent.click(screen.getByText("Manufacturer 2 with a long name to test wrapping"));
    await userEvent.click(screen.getByText("Manufacturer 5 with a long name to test wrapping"));
    await userEvent.click(screen.getByText("Manufacturer 8 with a long name to test wrapping"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenLastCalledWith([
      "manufacturer-2",
      "manufacturer-5",
      "manufacturer-8",
    ]);

    // remove one selection
    const popover = await within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByText("Manufacturer 5 with a long name to test wrapping"));
    expect(args["onUpdate:modelValue"]).toHaveBeenLastCalledWith([
      "manufacturer-2",
      "manufacturer-8",
    ]);
  },
};

export const VisualTestSearch: MtEntitySelectStory = {
  name: "should search for items",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await canvas.findByText("Manufacturers");

    // open the select and type a search term
    await userEvent.type(canvas.getByRole("textbox"), "Manufacturer 10");

    // wait for search results
    await screen.findByTestId("mt-select-option--manufacturer-101");

    // click on 101
    await userEvent.click(screen.getByTestId("mt-select-option--manufacturer-101"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenCalledWith("manufacturer-101");

    // check if input placeholder contains the selected item
    expect(canvas.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Manufacturer 101 with a long name to test wrapping",
    );
  },
};

export const VisualTestSearchMultiple: MtEntitySelectStory = {
  name: "should search for items with multiple selection",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await canvas.findByText("Manufacturers");

    // open the select and type a search term
    await userEvent.type(canvas.getByRole("textbox"), "Manufacturer 10");

    // wait for search results
    await screen.findByTestId("mt-select-option--manufacturer-101");

    // click on 101
    await userEvent.click(screen.getByTestId("mt-select-option--manufacturer-101"));

    // check if the value has been updated
    expect(args["onUpdate:modelValue"]).toHaveBeenCalledWith(["manufacturer-101"]);

    // Click outside to close the select
    await userEvent.click(document.body);

    // wait 400ms until the close animation is complete
    await new Promise((resolve) => setTimeout(resolve, 400));

    // check if selected value has an option holder (li with data-id="manufacturer-10")
    const optionHolder = await canvas.findByText(
      "Manufacturer 101 with a long name to test wrapping",
    );
    expect(optionHolder).toBeInTheDocument();
  },
};

export const VisualTestPagination: MtEntitySelectStory = {
  name: "should paginate to load more items",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait for data to be loaded
    await canvas.findByText("Manufacturers");

    // open the select
    await userEvent.click(canvas.getByRole("textbox"));

    // wait for options to appear
    await screen.findByText("Manufacturer 5 with a long name to test wrapping");

    // scroll to the bottom of the results list
    let resultsList = document.querySelector(".mt-select-result-list__content");
    resultsList?.scrollTo(0, resultsList.scrollHeight);

    // wait for more options to be loaded
    await screen.findByText("Manufacturer 50 with a long name to test wrapping");

    // scroll again to the bottom of the results list
    resultsList = document.querySelector(".mt-select-result-list__content");
    resultsList?.scrollTo(0, resultsList.scrollHeight);

    // wait for more options to be loaded
    await screen.findByText("Manufacturer 99 with a long name to test wrapping");

    // wait 500ms until the pagination is complete for snapshot
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};
