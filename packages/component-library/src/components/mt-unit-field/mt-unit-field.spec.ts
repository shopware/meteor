import { render, screen } from "@testing-library/vue";
import MtUnitField from "./mt-unit-field.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-unit-field", () => {
  it("is not possible to change the value when inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUnitField, {
      props: {
        modelValue: 0,
        defaultUnit: "mm",
        isInheritanceField: true,
        isInherited: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("converts value when unit is changed", async () => {
    // ARRANGE
    const modelValueHandler = vi.fn();
    const unitHandler = vi.fn();

    render(MtUnitField, {
      props: {
        modelValue: 1,
        defaultUnit: "m",
        measurementType: "length",
        digits: 3,
        "onUpdate:modelValue": modelValueHandler,
        "onUpdate:defaultUnit": unitHandler,
      },
    });

    // ACT
    const unitSelect = screen.getByTestId("unit-select-trigger");
    await userEvent.click(unitSelect);

    const ydOption = screen.getByTestId("unit-select-option-yd");
    expect(ydOption).toBeInTheDocument();
    await userEvent.click(ydOption);

    // ASSERT
    expect(modelValueHandler).toHaveBeenCalledWith(1.094); // 1 m = 1.094 yd
    expect(unitHandler).toHaveBeenCalledWith("yd");
  });

  it("displays different units when property measurementType is changed", async () => {
    // ARRANGE
    render(MtUnitField, {
      props: {
        modelValue: 1,
        defaultUnit: "g",
        measurementType: "mass",
      },
    });

    // ACT
    await userEvent.click(screen.getByTestId("unit-select-trigger"));

    // ASSERT
    expect(screen.getByTestId("unit-select-option-kg")).toBeInTheDocument();
    expect(screen.getByTestId("unit-select-option-g")).toBeInTheDocument();
    expect(screen.queryByTestId("unit-select-option-m")).not.toBeInTheDocument();
  });

  it("can change unit with arrow keys", async () => {
    // ARRANGE
    const modelValueHandler = vi.fn();
    const unitHandler = vi.fn();

    render(MtUnitField, {
      props: {
        modelValue: 100,
        defaultUnit: "mm",
        measurementType: "length",
        "onUpdate:modelValue": modelValueHandler,
        "onUpdate:defaultUnit": unitHandler,
      },
    });

    // ACT
    await userEvent.click(screen.getByTestId("unit-select-trigger"));

    expect(screen.getByTestId("unit-select-option-mm")).toBeInTheDocument();
    await userEvent.keyboard("{arrowdown}"); // navigate to cm
    await userEvent.keyboard("{arrowdown}"); // navigate to m
    await userEvent.keyboard("{arrowdown}"); // navigate to in
    await userEvent.keyboard("{arrowup}"); // navigate back to m
    await userEvent.keyboard("{enter}");

    // ASSERT
    expect(modelValueHandler).toHaveBeenCalledWith(0.1); // 100 mm = 1 m
    expect(unitHandler).toHaveBeenCalledWith("m");
  });
});
