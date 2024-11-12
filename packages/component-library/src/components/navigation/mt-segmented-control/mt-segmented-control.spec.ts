import { render, screen } from "@testing-library/vue";
import { vi, describe, it, expect } from "vitest";
import MtSegmentedControl from "./mt-segmented-control.vue";
import { userEvent } from "@storybook/test";

describe("mt-segmented-control", () => {
  it("emits an event when clicking on an action", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSegmentedControl, {
      props: {
        actions: [
          {
            id: "labelStart",
            label: "Label",
            onClick: handler,
            hasCheckbox: false,
          },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Label" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an event when checking a checkbox", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtSegmentedControl, {
      props: {
        actions: [
          {
            id: "labelStart",
            label: "Label",
            onClick: handler,
            hasCheckbox: true,
          },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenLastCalledWith({ checkboxValue: true });
  });

  it("does not emit an event when clicking on a disabled action", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtSegmentedControl, {
      props: {
        actions: [
          {
            id: "labelStart",
            label: "Label",
            onClick: handler,
            disabled: true,
          },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Label" }));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not emit an event when clicking on a disabled checkbox", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtSegmentedControl, {
      props: {
        actions: [
          {
            id: "labelStart",
            label: "Label",
            onClick: handler,
            hasCheckbox: true,
            disabled: true,
          },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });
});
