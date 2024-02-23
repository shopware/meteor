import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { waitUntilRendered } from "../../../_internal/test-helper";

import meta, { type SwSelectMeta, type SwSelectStory } from "./sw-select.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-select",
} as SwSelectMeta;

export const TestRemovalOfSelectionByList: SwSelectStory = {
  name: "Should remove selections through selection list",
  args: {
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("sw-select-option--a"));

    expect(args.change).toHaveBeenCalledWith(["b", "d"]);
  },
};

export const TestRemoveSelectionByResultItem: SwSelectStory = {
  name: "Should remove selection through result item",
  args: {
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getAllByTestId("dismiss-label")[0]);

    expect(args.change).toHaveBeenCalledWith(["b", "d"]);
  },
};

export const TestClearSelections: SwSelectStory = {
  name: "Should clear selections",
  args: {
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("select-clear-button"));

    expect(args.change).toHaveBeenCalledWith([]);
  },
};

export const VisualTestSingleSelection: SwSelectStory = {
  name: "Should single select",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "A");
    await new Promise((resolve) => setTimeout(resolve, 300));

    let popover = within(document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement);
    await waitUntilRendered(() => popover.getByTestId("sw-select-option--a"));
    await userEvent.click(popover.getByTestId("sw-select-option--a"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 1,
      value: "a",
      label: "Option A",
    });

    expect(args.change).toHaveBeenCalledWith("a");
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");

    await userEvent.type(canvas.getByRole("textbox"), "F");
    await new Promise((resolve) => setTimeout(resolve, 300));
    popover = within(document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement);

    await waitUntilRendered(() => popover.getByTestId("sw-select-option--f"));
    await userEvent.click(popover.getByTestId("sw-select-option--f"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 6,
      value: "f",
      label: "Option F",
    });

    expect(args.change).toHaveBeenCalledWith("f");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");

    // Only 'FF' is selected
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement);

    await waitUntilRendered(() => popover.getByTestId("sw-select-option--ff"));
    await userEvent.click(popover.getByTestId("sw-select-option--ff"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "Option FF",
    });

    expect(args.change).toHaveBeenCalledWith("ff");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");
  },
};

export const VisualTestMultiSelect: SwSelectStory = {
  name: "Should multi select",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // open selection
    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("sw-select-option--a"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 1,
      value: "a",
      label: "Option A",
    });

    expect(args.change).toHaveBeenCalledWith(["a"]);

    await userEvent.click(popover.getByTestId("sw-select-option--b"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 2,
      value: "b",
      label: "Option B",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b"]);

    await userEvent.click(popover.getByTestId("sw-select-option--c"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 3,
      value: "c",
      label: "Option C",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b", "c"]);

    await userEvent.click(popover.getByTestId("sw-select-option--e"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 5,
      value: "e",
      label: "Option E",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b", "c", "e"]);

    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");
  },
};

export const VisualTestPrefix: SwSelectStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: SwSelectStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: SwSelectStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => {
      // Check if selection list item contains "Option B"
      const selectionListItem = document.querySelector(".sw-select-selection-list__item");
      return selectionListItem?.textContent === "Option B";
    });

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: SwSelectStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = document.querySelector(".sw-popover-deprecated__wrapper");
    expect(popover).toBe(null);
  },
};

export const VisualTestError: SwSelectStory = {
  name: "Should display error",
  args: {
    error: {
      code: 500,
      detail: "Error while saving!",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => {
      // Check if selection list item contains "Option B"
      const selectionListItem = document.querySelector(".sw-select-selection-list__item");
      return selectionListItem?.textContent === "Option B";
    });

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestHighlightSearchTerm: SwSelectStory = {
  name: "Should highlight search term",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "A");

    // wait until only one result is rendered
    await waitUntilRendered(() => document.getElementsByClassName("sw-select-result").length === 1);

    const popover = within(
      document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement,
    );
    // Option A is separated in different elements. This methods get the combined instance.
    expect(
      popover.getByText((content, element) => {
        const hasText = (element: HTMLElement) => element.textContent === "Option A";
        const elementHasText = hasText(element as HTMLElement);
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child as HTMLElement),
        );

        return elementHasText && childrenDontHaveText;
      }),
    ).toBeDefined();
  },
};

export const VisualTestInherited: SwSelectStory = {
  name: "Should trigger inheritance-remove event",
  args: {
    label: "Inherited",
    isInheritanceField: true,
    isInherited: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("sw-inheritance-switch-icon"));

    expect(args.inheritanceRemove).toHaveBeenCalledWith();
  },
};

export const VisualTestEnsureSingleSelectionWithoutLoadMore: SwSelectStory = {
  name: "Should not show load more",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() =>
      document.querySelector('.sw-select-selection-list__item[title="Option B"]'),
    );

    await userEvent.type(canvas.getByRole("textbox"), "Option long text");
    await waitUntilRendered(() => {
      // Check if highlight text contains the search term
      const highlight = document.querySelector(".sw-highlight-text__highlight");
      return highlight?.textContent === "Option long text";
    });

    const popover = within(
      document.querySelector(".sw-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("sw-select-option--Longer value text"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 8,
      label: "Option long text",
      value: "Longer value text",
    });

    expect(args.change).toHaveBeenCalledWith("Longer value text");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");
    expect(canvas.queryByText("+12")).toBeNull();
  },
};
