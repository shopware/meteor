import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtCheckbox from "./mt-checkbox.vue";

describe("mt-checkbox", () => {
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
