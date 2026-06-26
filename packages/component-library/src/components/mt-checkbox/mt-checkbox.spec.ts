import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtCheckbox from "./mt-checkbox.vue";

describe("mt-checkbox", () => {
  it("shows a checkmark when checked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not show a checkmark when unchecked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("emits an event when clicking the input", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
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

  it("emits an event when toggling it with the space key", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("checkbox"), "{Space}");

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("checks the checkbox when clicking the label", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtCheckbox, {
      props: {
        checked: false,
        onChange: handler,
        label: "Checkbox",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("focuses the checkbox when clicking the label", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        label: "Checkbox",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it("has the correct name when submitting a form", async () => {
    await render(MtCheckbox, {
      props: {
        name: "over-18",
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAttribute("name", "over-18");
  });

  it("can be disabled", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("does not emit an event when clicking on a disabled checkbox", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
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

  it("can be required", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeRequired();
  });

  it("is not required by default", async () => {
    // ARRANGE
    render(MtCheckbox);

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeRequired();
  });

  it("shows a help text when defined", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        helpText: "Help text",
      },
    });

    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Help text");

    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("displays an error message when defined", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        error: {
          detail: "Error message",
        },
      },
    });

    // ASSERT
    expect(screen.getByText("Error message")).toBeVisible();
  });

  it("has an indeterminate state", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        partial: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("keeps its checked state when it is partially checked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: true,
        partial: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("emits an update:checked event when clicking the checkbox", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        checked: true,
        "onUpdate:checked": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("keeps its unchecked state when it is partially checked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
        partial: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("shows as tooltip when focusing the inheritance switch", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        label: "Inherited",
        inheritedValue: false,
        isInherited: true,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("emits an inheritance-remove event when unlinking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        label: "Inherited",
        inheritedValue: true,
        isInherited: true,
        // @ts-expect-error
        onInheritanceRemove: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an inheritance-restore event when restoring the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        label: "Inherited",
        inheritedValue: false,
        isInherited: false,
        // @ts-expect-error
        onInheritanceRestore: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("shows the inherited value when it is inherited", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
        // @ts-expect-error -- isInheritanceField is not typed, yet
        isInheritanceField: true,
        isInherited: true,
        inheritedValue: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows the overridden value when it is not inherited", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
        // @ts-expect-error -- isInheritanceField is not typed, yet
        isInheritanceField: true,
        isInherited: false,
        inheritedValue: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("is disabled when inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        // @ts-expect-error -- isInheritanceField is not typed, yet
        isInheritanceField: true,
        isInherited: true,
        inheritedValue: true,
        checked: false,
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
});
