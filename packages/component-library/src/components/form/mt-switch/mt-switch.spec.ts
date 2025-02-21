import { userEvent } from "@testing-library/user-event";
import MtSwitch from "./mt-switch.vue";
import { render, screen } from "@testing-library/vue";

describe("mt-switch", () => {
  it.each(["checked", "modelValue"])("is turned on", async (valueProp) => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        [valueProp]: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it.each(["checked", "modelValue"])("is turned off", async (valueProp) => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        [valueProp]: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])("emits an event when turning off the switch: %s, %s", async (valueProp, handlerProp) => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        [valueProp]: true,
        [handlerProp]: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);
  });

  it.each([["checked", "onChange"]])(
    "emits an event when turning on the switch: %s, %s",
    async (valueProp, handlerProp) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtSwitch, {
        props: {
          [valueProp]: false,
          [handlerProp]: handler,
        },
      });

      // ACT
      await userEvent.click(screen.getByRole("checkbox"));

      // ASSERT
      expect(screen.getByRole("checkbox")).toBeChecked();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(true);
    },
  );

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])("cannot be turned off when it is disabled: %s, %s", async (valueProp, handlerProp) => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        [valueProp]: true,
        disabled: true,
        [handlerProp]: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).not.toHaveBeenCalled();
  });

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])("cannot be turned on when it is disabled: %s, %s", async (valueProp, handlerProp) => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        [valueProp]: false,
        disabled: true,
        [handlerProp]: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).not.toHaveBeenCalled();
  });

  it("gets focused when clicking on the label", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
        label: "Label",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Label"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])(
    "gets turned on when clicking on the label an it is turned off: %s, %s",
    async (valueProp, handlerProp) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtSwitch, {
        props: {
          [valueProp]: false,
          label: "Label",
          [handlerProp]: handler,
        },
      });

      // ACT
      await userEvent.click(screen.getByText("Label"));

      // ASSERT
      expect(screen.getByRole("checkbox")).toBeChecked();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(true);
    },
  );

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])(
    "gets turned off when clicking on the label an it is turned on: %s, %s",
    async (valueProp, handlerProp) => {
      const handler = vi.fn();

      render(MtSwitch, {
        props: {
          [valueProp]: true,
          label: "Label",
          [handlerProp]: handler,
        },
      });

      // ARRANGE
      await userEvent.click(screen.getByText("Label"));

      // ASSERT
      expect(screen.getByRole("checkbox")).not.toBeChecked();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(false);
    },
  );

  it("can be explictly required to be turned on", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeRequired();
  });

  it.each(["checked", "modelValue"])(
    "is not required to be turned on by default: %s",
    async (valueProp) => {
      // ARRANGE
      render(MtSwitch, {
        props: {
          [valueProp]: false,
        },
      });

      // ASSERT
      expect(screen.getByRole("checkbox")).not.toBeRequired();
    },
  );

  it("has the defined name when submitting a form", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        name: "some-name",
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAttribute("name", "some-name");
  });

  it("cannot be turned off when it inherits a value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        inheritedValue: true,
        isInheritanceField: true,
        isInherited: true,
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeDisabled();

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(handler).not.toHaveBeenCalled();
  });

  it.each([
    ["checked", "onChange"],
    ["modelValue", "onUpdate:modelValue"],
  ])(
    "can be turned on when it overrides the inherited value: %s, %s",
    async (valueProp, handlerProp) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtSwitch, {
        props: {
          [valueProp]: false,
          inheritedValue: false,
          isInheritanceField: true,
          isInherited: false,
          [handlerProp]: handler,
        },
      });

      // ACT
      await userEvent.click(screen.getByRole("checkbox"));

      // ASSERT
      expect(screen.getByRole("checkbox")).toBeChecked();

      expect(screen.getByRole("checkbox")).not.toBeDisabled();
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(true);
    },
  );

  it("can be unlinked from its inherited value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        // @ts-expect-error -- Type is not defined
        onInheritanceRemove: handler,
        checked: false,
        inheritedValue: true,
        isInheritanceField: true,
        isInherited: true,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Unlink inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("can be linked to its inherited value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        // @ts-expect-error -- Type is not defined
        onInheritanceRestore: handler,
        checked: false,
        inheritedValue: false,
        isInheritanceField: true,
        isInherited: false,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Link inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it.each([["checked", "modelValue"]])(
    "shows the inherited value over its overriden value inheritance is linked: %s",
    async (valueProp) => {
      // ARRANGE
      render(MtSwitch, {
        props: {
          [valueProp]: false,
          inheritedValue: true,
          isInheritanceField: true,
          isInherited: true,
        },
      });

      // ASSERT
      expect(screen.getByRole("checkbox")).toBeChecked();
    },
  );

  it.each(["checked", "modelValue"])(
    "shows the overriden value over its inherited value when inheritance is unlinked: %s",
    async (valueProp) => {
      // ARRANGE
      render(MtSwitch, {
        props: {
          [valueProp]: false,
          inheritedValue: true,
          isInheritanceField: true,
          isInherited: false,
        },
      });

      // ASSERT
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    },
  );

  it("displays a help text when one is defined", async () => {
    // ARRANGE
    await render(MtSwitch, {
      props: {
        helpText: "Help text",
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("does not show a help text by default", async () => {
    // ARRANGE
    render(MtSwitch);

    // ASSERT
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("announces the error message when it is invalid", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
        required: true,
        error: {
          detail: "Some error message",
        },
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Some error message").getAttribute("id"),
    );
  });

  it("announces the checkbox as invalid when it has an error", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        error: {
          detail: "Some error message",
        },
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeInvalid();
  });

  it("is not invalid by default", async () => {
    // ARRANGE
    render(MtSwitch);

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeInvalid();
  });

  it("has a has an aria-label with the value of the label property", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        label: "Some label",
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Some label");
  });

  it("has the correct aria-label", async () => {
    // ARRANGE
    render(MtSwitch, {
      attrs: {
        "aria-label": "Some label",
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Some label");
  });

  it("has no aria-label by default", async () => {
    // ARRANGE
    render(MtSwitch);

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-label");
  });
});
