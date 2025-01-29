import { userEvent } from "@storybook/test";
import MtSwitch from "./mt-switch.vue";
import { render, screen } from "@testing-library/vue";

describe("mt-switch", () => {
  it("is turned on", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is turned off", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("emits an event when turning off the switch", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: true,
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("emits an event when turning on the switch", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: false,
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("cannot be turned off when it is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: true,
        disabled: true,
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).not.toHaveBeenCalled();
  });

  it("cannot be turned on when it is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: false,
        disabled: true,
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
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

  it("gets turned on when clicking on the label an it is turned off", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: false,
        label: "Label",
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Label"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("gets turned off when clicking on the label an it is turned on", async () => {
    const handler = vi.fn();
    render(MtSwitch, {
      props: {
        checked: true,
        label: "Label",
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ARRANGE
    await userEvent.click(screen.getByText("Label"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("can be explictly required to be turned on", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeRequired();
  });

  it("is not required to be turned on by default", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeRequired();
  });

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
        // @ts-expect-error -- Type is not defined, but accessed via this.$attrs
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

  it("can be turned on when it overrides the inherited value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: false,
        inheritedValue: false,
        // @ts-expect-error -- Type is not defined, but accessed via this.$attrs
        isInheritanceField: true,
        isInherited: false,
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(screen.getByRole("checkbox")).not.toBeDisabled();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });
});
