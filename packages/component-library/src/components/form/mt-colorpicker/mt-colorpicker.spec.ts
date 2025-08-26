import userEvent from "@testing-library/user-event";
import MtColorpicker from "./mt-colorpicker.vue";
import { render, screen } from "@testing-library/vue";

describe("mt-datepicker", () => {
  it("opens with keyboard", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    // ACT
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();
  });

  it("focuses the input when clicking on the label", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        label: "Some label",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Some label"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("allows value changes with keyboard", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        label: "Some label",
        modelValue: "#0fcff5",
      },
    });

    const user = userEvent.setup();

    // ACT
    await user.tab();
    await user.keyboard("{Enter}");

    // Focus color slider
    await userEvent.keyboard("{Tab}");

    // Change value with arrow key
    await userEvent.keyboard("{Arrowleft}");

    expect(screen.getByRole("textbox", { name: "Some label" })).toHaveValue("#10cef4");
  });

  it("has a placeholder", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        placeholder: "Some placeholder",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Some placeholder");
  });
});
