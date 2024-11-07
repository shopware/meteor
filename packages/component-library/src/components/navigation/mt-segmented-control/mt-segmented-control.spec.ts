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
          },
        ],
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Label" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });
});
