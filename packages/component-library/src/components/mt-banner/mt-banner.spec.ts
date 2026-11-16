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
    expect(closeHandler).toHaveBeenCalledOnce();
    expect(closeHandler).toHaveBeenCalledWith(undefined);
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
    expect(closeHandler).toHaveBeenCalledOnce();
    expect(closeHandler).toHaveBeenCalledWith("some-banner-index");
  });

  it("shows the icon of the variant in the solid style", () => {
    // ARRANGE
    render(MtBanner, { props: { variant: "critical" } });

    // ASSERT
    expect(screen.getByTestId("mt-icon__solid-exclamation-circle")).toBeInTheDocument();
  });

  it.each(["cog", "regular-cog", "solid-cog"])(
    "shows the custom icon %s in the solid style",
    (icon) => {
      // ARRANGE
      render(MtBanner, { props: { icon } });

      // ASSERT
      expect(screen.getByTestId("mt-icon__solid-cog")).toBeInTheDocument();
    },
  );
});
