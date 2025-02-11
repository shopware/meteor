import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
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
        // @ts-expect-error -- Event is not typed, yet
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
        // @ts-expect-error -- Event is not typed, yet
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
        // @ts-expect-error -- Event is not typed, yet
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
        // @ts-expect-error -- Event is not typed, yet
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
        // @ts-expect-error -- Event is not typed, yet
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

  it("emits an inheritance-remove event when unlinking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        // @ts-expect-error -- Event is not typed, yet
        isInheritanceField: true,
        isInherited: true,
        "onInheritance-remove": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByTestId("mt-inheritance-switch-icon"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an inheritance-restore event when linking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        // @ts-expect-error -- Event is not typed, yet
        isInheritanceField: true,
        isInherited: false,
        "onInheritance-restore": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByTestId("mt-icon__regular-link-horizontal-slash"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });
});
