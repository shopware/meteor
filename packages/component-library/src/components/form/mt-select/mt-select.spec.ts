import { userEvent } from "@storybook/test";
import { render, screen } from "@testing-library/vue";
import MtSelect from "./mt-select.vue";
import { flushPromises } from "@vue/test-utils";

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
});
