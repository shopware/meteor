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
});
