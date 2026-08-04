import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtThemeSelect from "./mt-theme-select.vue";

describe("mt-theme-select", () => {
  it("shows the label of the selected color theme", async () => {
    // ARRANGE
    render(MtThemeSelect, {
      props: {
        modelValue: "dark",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("Dark");
  });

  it("defaults to the system color theme", async () => {
    // ARRANGE
    render(MtThemeSelect);

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("System");
  });

  it("offers light, dark and system as options", async () => {
    // ARRANGE
    render(MtThemeSelect);

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(screen.getByTestId("mt-select-option--light")).toBeVisible();
    expect(screen.getByTestId("mt-select-option--dark")).toBeVisible();
    expect(screen.getByTestId("mt-select-option--system")).toBeVisible();
  });

  it("emits the selected color theme", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtThemeSelect, {
      props: {
        modelValue: "system",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.click(screen.getByTestId("mt-select-option--dark"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("dark");
  });

  it("renders the field label", async () => {
    // ARRANGE
    render(MtThemeSelect, {
      props: {
        label: "Color theme",
      },
    });

    // ASSERT
    expect(screen.getByText("Color theme")).toBeInTheDocument();
  });

  it("disables the select field", async () => {
    // ARRANGE
    render(MtThemeSelect, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
