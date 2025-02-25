import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";

import meta, { type MtSelectMeta, type MtSelectStory } from "./mt-select.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-select",
} as MtSelectMeta;

export const TestRemovalOfSelectionByList: MtSelectStory = {
  name: "Should remove selections through selection list",
  args: {
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

    expect(args.change).toHaveBeenCalledWith(["b", "d"]);
  },
};

export const TestRemoveSelectionByResultItem: MtSelectStory = {
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

export const TestClearSelections: MtSelectStory = {
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

export const VisualTestSingleSelection: MtSelectStory = {
  name: "Should single select",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "A");
    await new Promise((resolve) => setTimeout(resolve, 300));

    let popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);
    await waitUntil(() => popover.getByTestId("mt-select-option--a"));
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

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
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--f"));
    await userEvent.click(popover.getByTestId("mt-select-option--f"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 6,
      value: "f",
      label: "Option F",
    });

    expect(args.change).toHaveBeenCalledWith("f");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");

    // Only 'FF' is selected
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--ff"));
    await userEvent.click(popover.getByTestId("mt-select-option--ff"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "Option FF",
    });

    expect(args.change).toHaveBeenCalledWith("ff");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");
  },
};

export const VisualTestMultiSelect: MtSelectStory = {
  name: "Should multi select",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // open selection
    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 1,
      value: "a",
      label: "Option A",
    });

    expect(args.change).toHaveBeenCalledWith(["a"]);

    await userEvent.click(popover.getByTestId("mt-select-option--b"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 2,
      value: "b",
      label: "Option B",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b"]);

    await userEvent.click(popover.getByTestId("mt-select-option--c"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 3,
      value: "c",
      label: "Option C",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b", "c"]);

    await userEvent.click(popover.getByTestId("mt-select-option--e"));

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

export const VisualTestPrefix: MtSelectStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtSelectStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestPlaceholder: MtSelectStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Select an option",
    modelValue: undefined,
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByPlaceholderText(args.placeholder!)).toBeDefined();
  },
};

export const VisualTestPlaceholderMulti: MtSelectStory = {
  name: "Should display placeholder in multi select",
  args: {
    placeholder: "Select an option",
    modelValue: undefined,
    enableMultiSelection: true,
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByPlaceholderText(args.placeholder!)).toBeDefined();
  },
};

export const VisualTestHint: MtSelectStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitUntil(() => {
      // Check if selection list item contains "Option B"
      const selectionListItem = document.querySelector(".mt-select-selection-list__item");
      return selectionListItem?.textContent === "Option B";
    });

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: MtSelectStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: ["a", "b", "d"],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = document.querySelector(".mt-popover-deprecated__wrapper");
    expect(popover).toBe(null);
  },
};

export const VisualTestDisabledSingleOption: MtSelectStory = {
  name: "Should disable a single option",
  args: {
    modelValue: ["a", "c"],
    options: [
      { id: 1, label: "Option A", value: "a", disabled: false },
      { id: 2, label: "Option B", value: "b", disabled: true },
      { id: 3, label: "Option C", value: "c", disabled: false },
    ],
    enableMultiSelection: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = document.querySelector(".mt-popover-deprecated__wrapper");
    expect(popover).toBeVisible();

    // Check if option A and C are enabled, option B is disabled
    const optionA = document.querySelector('[data-testid="mt-select-option--a"]');
    const optionB = document.querySelector('[data-testid="mt-select-option--b"]');
    const optionC = document.querySelector('[data-testid="mt-select-option--c"]');

    expect(optionA).toBeVisible();
    expect(optionA).toHaveAttribute('aria-disabled', 'false');
    
    expect(optionB).toBeVisible();
    expect(optionB).toHaveAttribute('aria-disabled', 'true');

    expect(optionC).toBeVisible();
    expect(optionC).toHaveAttribute('aria-disabled', 'false');
  },
};

export const VisualTestError: MtSelectStory = {
  name: "Should display error",
  args: {
    error: {
      code: 500,
      detail: "Error while saving!",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => {
      // Check if selection list item contains "Option B"
      const selectionListItem = document.querySelector(".mt-select-selection-list__item");
      return selectionListItem?.textContent === "Option B";
    });

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestHighlightSearchTerm: MtSelectStory = {
  name: "Should highlight search term",
  args: {
    enableMultiSelection: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "A");

    // wait until only one result is rendered
    await waitUntil(() => document.getElementsByClassName("mt-select-result").length === 1);

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
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

export const VisualTestInherited: MtSelectStory = {
  name: "Should trigger inheritance-remove event",
  args: {
    label: "Inherited",
    isInheritanceField: true,
    isInherited: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-inheritance-switch-icon"));

    expect(args.inheritanceRemove).toHaveBeenCalledWith();
  },
};

export const VisualTestEnsureSingleSelectionWithoutLoadMore: MtSelectStory = {
  name: "Should not show load more",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitUntil(() =>
      document.querySelector('.mt-select-selection-list__item[title="Option B"]'),
    );

    await userEvent.type(canvas.getByRole("textbox"), "Option long text");
    await waitUntil(() => {
      // Check if highlight text contains the search term
      const highlight = document.querySelector(".mt-highlight-text__highlight");
      return highlight?.textContent === "Option long text";
    });

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--Longer value text"));

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

export const VisualTestEnsureCorrectMultiSelectionWrapping: MtSelectStory = {
  name: "Should wrap multi selection correctly",
  args: {
    enableMultiSelection: true,
    options: [
      {
        id: 1,
        label: "This is a very long option A with some text",
        value: "a",
      },
      {
        id: 2,
        label: "This is a very long option B with some text",
        value: "b",
      },
      {
        id: 3,
        label: "This is a very long option C with some text",
        value: "c",
      },
      {
        id: 4,
        label: "This is a very long option D with some text",
        value: "d",
      },
      {
        id: 5,
        label: "This is a very long option E with some text",
        value: "e",
      },
      {
        id: 6,
        label: "This is a very long option F with some text",
        value: "f",
      },
      {
        id: 7,
        label: "This is a very long option G with some text",
        value: "g",
      },
    ],
    modelValue: ["a", "b", "c", "d", "e", "f", "g"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loadMoreButton = canvas.getByText("+2");

    await userEvent.click(loadMoreButton);
  },
};

export const VisualTestEnsureSelectionOpensViaIndicators: MtSelectStory = {
  name: "Should open selection via indicators",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntil(() =>
      document.querySelector('.mt-select-selection-list__item[title="Option B"]'),
    );

    // open selection via indicator
    await userEvent.click(canvas.getByTestId("mt-select__select-indicator"));

    // selection should open
    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await waitUntil(() => popover.getByTestId("mt-select-option--a"));

    // close selection via indicator
    await userEvent.click(canvas.getByTestId("mt-select__select-indicator"));
    expect(document.querySelector(".mt-popover-deprecated__wrapper")).toBeNull();
  },
};
