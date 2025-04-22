import { render, screen } from "@testing-library/vue";
import MtInheritanceSwitch from "./mt-inheritance-switch.vue";
import userEvent from "@testing-library/user-event";

describe("mt-inheritance-switch", () => {
  it("shows a tooltip when focusing the inheritance switch", async () => {
    // ARRANGE
    render(MtInheritanceSwitch, {
      props: {
        isInherited: true,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("tells the user that the inheritance switch is inherited", async () => {
    // ARRANGE
    render(MtInheritanceSwitch, {
      props: {
        isInherited: true,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toHaveTextContent("Remove inheritance");
  });

  it("tells the user that the inheritance switch is not inherited", async () => {
    // ARRANGE
    render(MtInheritanceSwitch, {
      props: {
        isInherited: false,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toHaveTextContent("Restore inheritance");
  });

  it("emits a inheritance-remove event when unlinking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtInheritanceSwitch, {
      props: {
        isInherited: true,
        onInheritanceRemove: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits a inheritance-restore event when restoring the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtInheritanceSwitch, {
      props: {
        isInherited: false,
        onInheritanceRestore: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });
});
