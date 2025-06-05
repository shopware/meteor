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
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
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
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option A");

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
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
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option F");

    // Only 'FF' is selected
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--ff"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await userEvent.click(popover.getByTestId("mt-select-option--ff"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "Option FF",
    });

    expect(args.change).toHaveBeenCalledWith("ff");
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option FF");
  },
};

export const VisualTestSingleSelectionOptionAsValue: MtSelectStory = {
  name: "Should single select using option as value",
  args: {
    valueProperty: "",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "A");
    await new Promise((resolve) => setTimeout(resolve, 300));

    let popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);
    await waitUntil(() => popover.getByTestId("mt-select-option--a"));
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

    expect(args.change).toHaveBeenCalledWith({
      id: 1,
      value: "a",
      label: "Option A",
    });

    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option A");

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "F");
    await new Promise((resolve) => setTimeout(resolve, 300));
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--f"));
    await userEvent.click(popover.getByTestId("mt-select-option--f"));

    expect(args.change).toHaveBeenCalledWith({
      id: 6,
      value: "f",
      label: "Option F",
    });

    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option F");

    // Only 'FF' is selected
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--ff"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await userEvent.click(popover.getByTestId("mt-select-option--ff"));

    expect(args.change).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "Option FF",
    });

    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option FF");
  },
};

export const VisualTestSingleSelectionSmall: MtSelectStory = {
  name: "Should single select in small",
  args: {
    small: true,
    options: [
      {
        id: 1,
        label: "A very long A",
        value: "a",
      },
      {
        id: 2,
        label: "A very long B",
        value: "b",
      },
      {
        id: 3,
        label: "A very long C",
        value: "c",
      },
      {
        id: 6,
        label: "A very long F",
        value: "f",
      },
      {
        id: 7,
        label: "A very long FF",
        value: "ff",
      },
      {
        id: 8,
        label: "A very long long text",
        value: "Longer value text",
      },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "A");
    await new Promise((resolve) => setTimeout(resolve, 300));

    let popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);
    await waitUntil(() => popover.getByTestId("mt-select-option--a"));
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 1,
      value: "a",
      label: "A very long A",
    });

    expect(args.change).toHaveBeenCalledWith("a");
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("A very long A");

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "F");
    await new Promise((resolve) => setTimeout(resolve, 300));
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--f"));
    await userEvent.click(popover.getByTestId("mt-select-option--f"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 6,
      value: "f",
      label: "A very long F",
    });

    expect(args.change).toHaveBeenCalledWith("f");
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("A very long F");

    // Only 'FF' is selected
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--ff"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await userEvent.click(popover.getByTestId("mt-select-option--ff"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "A very long FF",
    });

    expect(args.change).toHaveBeenCalledWith("ff");
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("A very long FF");
  },
};

export const VisualTestSingleSelectionLongInSmallWidth: MtSelectStory = {
  name: "Should single select long option in small width",
  args: {
    _wrapperWidth: "200px",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
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
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option A");

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
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
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option F");

    // Only 'FF' is selected
    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.clear(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "FF");
    popover = within(document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement);

    await waitUntil(() => popover.getByTestId("mt-select-option--ff"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await userEvent.click(popover.getByTestId("mt-select-option--ff"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 7,
      value: "ff",
      label: "Option FF",
    });

    expect(args.change).toHaveBeenCalledWith("ff");
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option FF");

    // Click outside to close popover
    await userEvent.click(canvas.getByText("hidden"));
  },
};

export const VisualTestMultiSelect: MtSelectStory = {
  name: "Should multi select",
  args: {
    modelValue: undefined,
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

export const VisualTestMultiSelectOptionAsValue: MtSelectStory = {
  name: "Should multi select using option as value",
  args: {
    modelValue: undefined,
    enableMultiSelection: true,
    valueProperty: "",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // open selection
    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--a"));

    expect(args.change).toHaveBeenCalledWith([
      {
        id: 1,
        value: "a",
        label: "Option A",
      },
    ]);

    await userEvent.click(popover.getByTestId("mt-select-option--b"));

    expect(args.change).toHaveBeenCalledWith([
      {
        id: 1,
        value: "a",
        label: "Option A",
      },
      {
        id: 2,
        value: "b",
        label: "Option B",
      },
    ]);

    await userEvent.click(popover.getByTestId("mt-select-option--c"));

    expect(args.change).toHaveBeenCalledWith([
      {
        id: 1,
        value: "a",
        label: "Option A",
      },
      {
        id: 2,
        value: "b",
        label: "Option B",
      },
      {
        id: 3,
        value: "c",
        label: "Option C",
      },
    ]);

    await userEvent.click(popover.getByTestId("mt-select-option--e"));

    expect(args.change).toHaveBeenCalledWith([
      {
        id: 1,
        value: "a",
        label: "Option A",
      },
      {
        id: 2,
        value: "b",
        label: "Option B",
      },
      {
        id: 3,
        value: "c",
        label: "Option C",
      },
      {
        id: 5,
        value: "e",
        label: "Option E",
      },
    ]);

    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("");
  },
};

export const VisualTestMultiSelectWithInitialValue: MtSelectStory = {
  name: "Should multi select with initial value",
  args: {
    modelValue: "a",
    enableMultiSelection: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // open selection
    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--b"));

    expect(args.itemAdd).toHaveBeenCalledWith({
      id: 2,
      value: "b",
      label: "Option B",
    });

    expect(args.change).toHaveBeenCalledWith(["a", "b"]);

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
      // Check if input item contains "Option B"
      const selectionListItem = document.querySelector(
        ".mt-select-selection-list__input",
      ) as HTMLInputElement;
      return selectionListItem?.value === "Option B";
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
    expect(optionA).toHaveAttribute("aria-disabled", "false");

    expect(optionB).toBeVisible();
    expect(optionB).toHaveAttribute("aria-disabled", "true");

    expect(optionC).toBeVisible();
    expect(optionC).toHaveAttribute("aria-disabled", "false");
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
      // Check if input item contains "Option B"
      const selectionListItem = document.querySelector(
        ".mt-select-selection-list__input",
      ) as HTMLInputElement;
      return selectionListItem?.value === "Option B";
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
    await waitUntil(() => {
      // Check if input item contains "Option B"
      const selectionListItem = document.querySelector(
        ".mt-select-selection-list__input",
      ) as HTMLInputElement;
      return selectionListItem?.value === "Option B";
    });

    await userEvent.clear(canvas.getByRole("textbox"));
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
    // Click outside to trigger blur
    await userEvent.click(canvas.getByText("hidden"));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Option long text");
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
    await waitUntil(() => {
      // Check if input item contains "Option B"
      const selectionListItem = document.querySelector(
        ".mt-select-selection-list__input",
      ) as HTMLInputElement;
      return selectionListItem?.value === "Option B";
    });

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

export const VisualTestMultipleSelectsOnOnePage: MtSelectStory = {
  name: "Should close other selects when opening a new one",
  args: {
    _secondSelect: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the second select below the first one
    const secondSelect = canvas.getAllByRole("textbox").at(1);
    expect(secondSelect).toBeDefined();
    // @ts-ignore - secondSelect is a HTMLElement
    await userEvent.click(secondSelect);

    // Open the primary select above the second one
    const primary = canvas.getAllByRole("textbox").at(0);
    expect(primary).toBeDefined();
    // @ts-ignore - primary is a HTMLElement
    await userEvent.click(primary);
  },
};

export const VisualTestPlaceholderBehavior: MtSelectStory = {
  name: "Should show placeholder when alwaysShowPlaceholder is true",
  args: {
    placeholder: "Select an option",
    modelValue: undefined,
    enableMultiSelection: true,
    alwaysShowPlaceholder: true,
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByPlaceholderText(args.placeholder!)).toBeDefined();
  },
};

export const VisualTestPlaceholderBehaviorFalse: MtSelectStory = {
  name: "Should not show placeholder when alwaysShowPlaceholder is false",
  args: {
    placeholder: "Select an option",
    modelValue: undefined,
    enableMultiSelection: true,
    alwaysShowPlaceholder: false,
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByPlaceholderText(args.placeholder!)).toBeNull();
  },
};
