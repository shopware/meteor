import { userEvent } from "@storybook/test";
import { render, screen, fireEvent } from "@testing-library/vue";
import MtSelect from "./mt-select.vue";
import { flushPromises } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("mt-select", () => {
  it("opens the option list when clicking on the field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("combobox"));

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("does not open the option list when focusing the field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the option list when clicking outside of it", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("updates the value when clicking on an option", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSelect, {
      props: {
        "onUpdate:modelValue": handler,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await userEvent.click(screen.getByRole("option", { name: "Option 1" }));

    // ASSERT
    expect(screen.getByRole("combobox")).toHaveValue("Option 1");
    expect(handler).toHaveBeenNthCalledWith(1, "1");
  });

  it("clicking on the label opens the option list", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        label: "Select an option",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await flushPromises();

    // ACT
    await userEvent.click(screen.getByText("Select an option"));

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("hides the label when there is not label specified", () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    // ASSERT
    expect(screen.queryByTestId("mt-select__label")).not.toBeInTheDocument();
  });

  it("closes the option list when clicking on the input and the list is already open", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await userEvent.click(screen.getByRole("combobox"));

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the option list after selecting an option", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await userEvent.click(screen.getByRole("option", { name: "Option 1" }));

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open the option list when clicking on a disabled field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        disabled: true,
        options: [],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("combobox"));

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows an error message when there is an error", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        error: { detail: "This is an error" },
        options: [],
      },
    });

    // ASSERT
    expect(screen.getByText("This is an error")).toBeVisible();
  });

  it("does not show an error message when there is no error", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    // ASSERT
    expect(screen.queryByTestId("mt-select__error")).not.toBeInTheDocument();
  });

  it("shows a hint message when there is one defined", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
      slots: {
        hint: "This is a hint",
      },
    });

    // ASSERT
    expect(screen.getByText("This is a hint")).toBeVisible();
  });

  it("does not show a hint message when there is no hint defined", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    // ASSERT
    expect(screen.queryByTestId("mt-select__hint")).not.toBeInTheDocument();
  });

  it("filters the options when typing in the field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    // We need to use fireEvent here because
    // userEvent.type closes the listbox
    await fireEvent.input(screen.getByRole("combobox"), { target: { value: "1" } });

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toBeVisible();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });

  it("filters the options when using a custom search algorithm", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
        searchFunction: ({ searchTerm, option }) => !option.label.includes(searchTerm),
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await fireEvent.input(screen.getByRole("combobox"), { target: { value: "1" } });

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 2" })).toBeVisible();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("closes the option list when pressing the escape key inside the field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ACT
    await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the option list when pressing the escape key and an option is focused", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("announces to screen readers that the combobox controls the listbox", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    await flushPromises();

    // ACT
    await userEvent.click(screen.getByRole("combobox"));

    // ASSERT
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-controls",
      screen.getByRole("listbox").getAttribute("id"),
    );
  });

  it("does not announce to screen readers that the combobox controls the listbox when the listbox is not visible", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    // ASSERT
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-controls");
  });

  it("announces to screen readers that the combobox is expanded when the listbox is visible", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    await userEvent.click(screen.getByRole("combobox"));

    // ASSERT
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("announces to screen readers that the combobox is collapsed when the listbox is not visible", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [],
      },
    });

    // ASSERT
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the option list when pressing the arrow down key when focusing the input", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("opens the option list when pressing the arrow down and alt key when focusing the input", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{Alt}{ArrowDown}");

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("marks the first option as selected when pressing the arrow down key on the input field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 1" }).getAttribute("id"),
    );
  });

  it("marks the second option as selected when pressing the arrow down key twice on the input field", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 2" }).getAttribute("id"),
    );
  });

  it("marks the first option as selected when pressing the arrow down key and the last option is selected", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 1" }).getAttribute("id"),
    );
  });

  it("opens the listbox when pressing the arrow up key", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("marks the last option as selected when pressing the arrow up key", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 2" }).getAttribute("id"),
    );
  });

  it("marks the previous option as selected when pressing the arrow up key twice", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowUp}");

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 1" }).getAttribute("id"),
    );
  });

  it("marks the last option as selected when pressing the arrow up key and the first option is selected", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      },
    });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Option 2" }).getAttribute("id"),
    );
  });

  it("selects the option when pressing the enter key on the input field", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSelect, {
      props: {
        "onUpdate:modelValue": handler,
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{Enter}");

    // ASSERT
    expect(handler).toHaveBeenNthCalledWith(1, "1");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
