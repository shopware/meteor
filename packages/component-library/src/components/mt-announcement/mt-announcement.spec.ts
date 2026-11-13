import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MtAnnouncement from "./mt-announcement.vue";

describe("mt-announcement", () => {
  it("emits close when its close button is clicked", async () => {
    // ARRANGE
    const onClose = vi.fn();
    render(MtAnnouncement, {
      props: { closable: true, onClose },
      slots: { default: "Planned maintenance on Sunday" },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Close announcement" }));

    // ASSERT
    expect(onClose).toHaveBeenCalledOnce();
  });
});
