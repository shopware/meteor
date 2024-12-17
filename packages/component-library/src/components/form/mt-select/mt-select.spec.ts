import { userEvent } from "@storybook/test";
import { render, screen } from "@testing-library/vue";
import MtSelect from "./mt-select.vue";

describe("mt-select", () => {
  it("opens the option list when clicking on the field", async () => {
    // ARRANGE
    render(MtSelect);

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("opens the option list when focusing the field", async () => {
    // ARRANGE
    render(MtSelect);

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("closes the option list when clicking outside of it", async () => {
    // ARRANGE
    render(MtSelect);

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
      },
    });

    await userEvent.click(screen.getByRole("textbox"));

    // ACT
    await userEvent.click(screen.getByText("Option 1"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("Option 1");
    expect(handler).toHaveBeenNthCalledWith(1, "1");
  });
});
