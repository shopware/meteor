import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MtBanner from "./mt-banner.vue";

describe("mt-banner", () => {
  it("emits a close event when clicking on the close button", async () => {
    // ARRANGE
    const closeHandler = vi.fn();

    render(MtBanner, {
      props: { onClose: closeHandler, closable: true },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: /close/i }));

    // ASSERT
    expect(closeHandler).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it("emits a close event with the bannerIndex when clicking on the close button", async () => {
    // ARRANGE
    const closeHandler = vi.fn();

    render(MtBanner, {
      props: {
        onClose: closeHandler,
        closable: true,
        bannerIndex: "some-banner-index",
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: /close/i }));

    // ASSERT
    expect(closeHandler).toHaveBeenCalledExactlyOnceWith("some-banner-index");
  });
});
