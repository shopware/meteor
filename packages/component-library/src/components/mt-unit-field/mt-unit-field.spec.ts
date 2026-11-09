import { render, screen } from "@testing-library/vue";
import MtUnitField from "./mt-unit-field.vue";
import { userEvent } from "@testing-library/user-event";
import { convertUnit, type Unit } from "./units";

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

  it("converts values exactly like convert-units 2.3.4 did", () => {
    // Results recorded from convert-units 2.3.4 for the values 1, 12.5, 1000 and 0.3, so that
    // values in consumer data keep converting to the same numbers
    const values = [1, 12.5, 1000, 0.3];
    const expected: [Unit, Unit, number[]][] = [
      ["mm", "mm", [1, 12.5, 1000, 0.3]],
      ["mm", "cm", [0.1, 1.25, 100, 0.029999999999999995]],
      ["mm", "m", [0.001, 0.0125, 1, 0.0003]],
      ["mm", "in", [0.03937008, 0.49212600000000006, 39.37008, 0.011811024]],
      ["mm", "ft", [0.00328084, 0.041010500000000005, 3.28084, 0.000984252]],
      [
        "mm",
        "yd",
        [0.0010936133333333334, 0.013670166666666669, 1.0936133333333333, 0.00032808399999999997],
      ],
      ["cm", "mm", [10, 125, 10000, 3]],
      ["cm", "cm", [1, 12.5, 1000, 0.3]],
      ["cm", "m", [0.01, 0.125, 10, 0.003]],
      ["cm", "in", [0.3937008, 4.92126, 393.7008, 0.11811024]],
      ["cm", "ft", [0.0328084, 0.410105, 32.8084, 0.00984252]],
      ["cm", "yd", [0.010936133333333334, 0.13670166666666667, 10.936133333333332, 0.00328084]],
      ["m", "mm", [1000, 12500, 1000000, 300]],
      ["m", "cm", [100, 1250, 100000, 30]],
      ["m", "m", [1, 12.5, 1000, 0.3]],
      ["m", "in", [39.37008, 492.12600000000003, 39370.08, 11.811024]],
      ["m", "ft", [3.28084, 41.0105, 3280.84, 0.9842519999999999]],
      ["m", "yd", [1.0936133333333333, 13.670166666666667, 1093.6133333333335, 0.328084]],
      ["in", "mm", [25.399999187200024, 317.49998984000024, 25399.999187200025, 7.619999756160007]],
      [
        "in",
        "cm",
        [2.5399999187200026, 31.749998984000026, 2539.9999187200024, 0.7619999756160006],
      ],
      [
        "in",
        "m",
        [0.025399999187200026, 0.3174999898400003, 25.399999187200024, 0.007619999756160007],
      ],
      ["in", "in", [1, 12.5, 1000, 0.3]],
      [
        "in",
        "ft",
        [0.08333333333333333, 1.0416666666666665, 83.33333333333333, 0.024999999999999998],
      ],
      [
        "in",
        "yd",
        [0.027777777777777776, 0.34722222222222215, 27.777777777777775, 0.008333333333333333],
      ],
      ["ft", "mm", [304.7999902464003, 3809.999878080004, 304799.9902464003, 91.43999707392008]],
      ["ft", "cm", [30.47999902464003, 380.99998780800036, 30479.999024640027, 9.143999707392009]],
      ["ft", "m", [0.3047999902464003, 3.8099998780800037, 304.7999902464003, 0.09143999707392009]],
      ["ft", "in", [12, 150, 12000, 3.6]],
      ["ft", "ft", [1, 12.5, 1000, 0.3]],
      ["ft", "yd", [0.3333333333333333, 4.166666666666667, 333.3333333333333, 0.09999999999999999]],
      ["yd", "mm", [914.399970739201, 11429.999634240012, 914399.970739201, 274.31999122176023]],
      ["yd", "cm", [91.4399970739201, 1142.9999634240012, 91439.9970739201, 27.431999122176027]],
      ["yd", "m", [0.914399970739201, 11.429999634240012, 914.399970739201, 0.27431999122176026]],
      ["yd", "in", [36, 450, 36000, 10.799999999999999]],
      ["yd", "ft", [3, 37.5, 3000, 0.8999999999999999]],
      ["yd", "yd", [1, 12.5, 1000, 0.3]],
      ["g", "g", [1, 12.5, 1000, 0.3]],
      ["g", "kg", [0.001, 0.0125, 1, 0.0003]],
      [
        "g",
        "oz",
        [0.03527399072294044, 0.4409248840367555, 35.27399072294044, 0.010582197216882132],
      ],
      [
        "g",
        "lb",
        [0.0022046244201837776, 0.02755780525229722, 2.2046244201837775, 0.0006613873260551332],
      ],
      ["kg", "g", [1000, 12500, 1000000, 300]],
      ["kg", "kg", [1, 12.5, 1000, 0.3]],
      ["kg", "oz", [35.27399072294044, 440.92488403675554, 35273.99072294044, 10.582197216882133]],
      ["kg", "lb", [2.2046244201837775, 27.55780525229722, 2204.6244201837776, 0.6613873260551333]],
      ["oz", "g", [28.3495, 354.36875, 28349.5, 8.50485]],
      ["oz", "kg", [0.0283495, 0.35436874999999995, 28.3495, 0.00850485]],
      ["oz", "oz", [1, 12.5, 1000, 0.3]],
      ["oz", "lb", [0.0625, 0.78125, 62.5, 0.01875]],
      ["lb", "g", [453.592, 5669.9, 453592, 136.0776]],
      ["lb", "kg", [0.453592, 5.669899999999999, 453.592, 0.1360776]],
      ["lb", "oz", [16, 200, 16000, 4.8]],
      ["lb", "lb", [1, 12.5, 1000, 0.3]],
    ];

    for (const [from, to, results] of expected) {
      values.forEach((value, index) => {
        expect(convertUnit(value, from, to)).toBe(results[index]);
      });
    }
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

  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    render(MtUnitField, {
      props: {
        modelValue: 0,
        defaultUnit: "mm",
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    render(MtUnitField, {
      props: {
        modelValue: 0,
        defaultUnit: "mm",
      },
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", () => {
    // ARRANGE
    const { container } = render(MtUnitField, {
      props: {
        modelValue: 0,
        defaultUnit: "mm",
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });
});
