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
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("opens the option list when focusing the field", async () => {
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
    expect(screen.getByRole("listbox")).toBeVisible();
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

    await userEvent.click(screen.getByRole("textbox"));

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

    await userEvent.click(screen.getByRole("textbox"));

    // ACT
    await userEvent.click(screen.getByText("Option 1"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("Option 1");
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
    expect(screen.getByRole("textbox")).toHaveFocus();
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

  it("closes the option list after selecting an option", async () => {
    // ARRANGE
    render(MtSelect, {
      props: {
        options: [{ label: "Option 1", value: "1" }],
      },
    });

    await userEvent.click(screen.getByRole("textbox"));

    // ACT
    await userEvent.click(screen.getByText("Option 1"));

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
    await userEvent.click(screen.getByRole("textbox"));

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

    await userEvent.click(screen.getByRole("textbox"));

    // ACT
    // We need to use fireEvent here because
    // userEvent.type closes the listbox
    await fireEvent.input(screen.getByRole("textbox"), { target: { value: "1" } });

    // ASSERT
    expect(screen.getByText("Option 1")).toBeVisible();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });
});
