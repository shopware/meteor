import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

function renderBanner(props = {}, options = {}) {
  return render(MtGrantPermissionServiceBanner, {
    props: {
      ...props,
    },
    ...options,
  });
}

describe("mt-grant-permission-service-banner", () => {
  it("renders a decorative icon that is hidden from assistive technology", () => {
    // ARRANGE
    const { container } = renderBanner();

    // ASSERT
    const icon = container.querySelector(".mt-grant-permission-service-banner__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the compact layout by default", () => {
    // ARRANGE
    renderBanner();

    // ASSERT
    expect(screen.getByRole("region")).toHaveClass("mt-grant-permission-service-banner--compact");
  });

  it.each(["vertical", "compact", "wide"] as const)("renders the %s layout", (layout) => {
    // ARRANGE
    renderBanner({ layout });

    // ASSERT
    expect(screen.getByRole("region")).toHaveClass(`mt-grant-permission-service-banner--${layout}`);
  });

  it("emits grant when the user grants the permission", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { emitted } = renderBanner({ grantLabel: "Grant permission and activate" });

    // ACT
    await user.click(screen.getByRole("button", { name: "Grant permission and activate" }));

    // ASSERT
    expect(emitted("grant")).toHaveLength(1);
  });

  it("falls back to a translated label for the grant button", () => {
    // ARRANGE
    renderBanner();

    // ASSERT
    expect(screen.getByRole("button", { name: "Grant permission" })).toBeVisible();
  });

  it("opens the more info target in a new tab", () => {
    // ARRANGE
    renderBanner({ moreInfoLabel: "Read the docs", moreInfoUrl: "https://www.shopware.com" });

    // ASSERT
    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "https://www.shopware.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("does not render the more info button without a target", () => {
    // ARRANGE
    renderBanner({ moreInfoLabel: "Read the docs" });

    // ASSERT
    expect(screen.queryByRole("link", { name: "Read the docs" })).not.toBeInTheDocument();
  });

  it("blocks a second consent request while the first one runs", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { container, emitted } = renderBanner({ isLoading: true });

    // ACT
    const grantButton = container.querySelector(
      ".mt-grant-permission-service-banner__grant",
    ) as HTMLButtonElement;
    await user.click(grantButton);

    // ASSERT
    expect(grantButton).toBeDisabled();
    expect(emitted().grant).toBeUndefined();
  });

  it("does not emit grant when the banner is disabled", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { emitted } = renderBanner({ disabled: true });

    // ACT
    await user.click(screen.getByRole("button", { name: "Grant permission" }));

    // ASSERT
    expect(emitted().grant).toBeUndefined();
  });
});
