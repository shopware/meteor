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

  it("shows the inherited value over its overriden value inheritance is linked", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
        inheritedValue: true,
        isInheritanceField: true,
        isInherited: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows the overriden value over its inherited value when inheritance is unlinked", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
        inheritedValue: true,
        isInheritanceField: true,
        isInherited: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

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
});
