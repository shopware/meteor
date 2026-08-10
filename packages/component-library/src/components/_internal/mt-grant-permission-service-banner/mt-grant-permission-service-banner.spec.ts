import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import flushPromises from "flush-promises";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

const isService = vi.hoisted(() => vi.fn());
const grant = vi.hoisted(() => vi.fn());

vi.mock("@shopware-ag/meteor-admin-sdk/es/context", () => ({ isService }));
vi.mock("@shopware-ag/meteor-admin-sdk/es/_private/permissions", () => ({ grant }));

/**
 * Renders the banner and waits for the `isService` round-trip to settle, because
 * the banner stays hidden until the Administration confirms a service context.
 */
async function renderBanner(props = {}) {
  const result = render(MtGrantPermissionServiceBanner, { props });
  await flushPromises();

  return result;
}

function getGrantButton() {
  return screen.getByRole("button", { name: /Grant permission/ });
}

beforeEach(() => {
  // The mocks live at module scope, so their call history has to be dropped
  // between tests before the per-test behaviour is re-established.
  vi.clearAllMocks();

  isService.mockResolvedValue(true);
  grant.mockResolvedValue(undefined);
});

describe("mt-grant-permission-service-banner", () => {
  it("renders nothing outside of a service context", async () => {
    // ARRANGE
    isService.mockResolvedValue(false);

    // ACT
    await renderBanner();

    // ASSERT
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders nothing when the service context can not be resolved", async () => {
    // ARRANGE
    isService.mockRejectedValue(new Error("no channel counterpart"));

    // ACT
    await renderBanner();

    // ASSERT
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders a decorative icon that is hidden from assistive technology", async () => {
    // ARRANGE
    const { container } = await renderBanner();

    // ASSERT
    const icon = container.querySelector(".mt-grant-permission-service-banner__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("labels the banner with its own heading", async () => {
    // ARRANGE
    await renderBanner();

    // ASSERT
    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Grant permission to activate this service.",
    );
  });

  it("uses the compact layout by default", async () => {
    // ARRANGE
    await renderBanner();

    // ASSERT
    expect(screen.getByRole("region")).toHaveClass("mt-grant-permission-service-banner--compact");
  });

  it.each(["vertical", "compact", "wide"] as const)("renders the %s layout", async (layout) => {
    // ARRANGE
    await renderBanner({ layout });

    // ASSERT
    expect(screen.getByRole("region")).toHaveClass(`mt-grant-permission-service-banner--${layout}`);
  });

  it("uses the short grant label in the vertical layout", async () => {
    // ARRANGE
    await renderBanner({ layout: "vertical" });

    // ASSERT
    expect(screen.getByRole("button", { name: "Grant permission" })).toBeVisible();
  });

  it("uses the long grant label in the horizontal layouts", async () => {
    // ARRANGE
    await renderBanner({ layout: "wide" });

    // ASSERT
    expect(
      screen.getByRole("button", { name: "Grant permission and activate" }),
    ).toBeVisible();
  });

  it("grants the service permission when the user confirms", async () => {
    // ARRANGE
    const user = userEvent.setup();
    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state while the permission is being granted", async () => {
    // ARRANGE
    const user = userEvent.setup();
    let resolveGrant: () => void = () => {};
    grant.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveGrant = resolve;
      }),
    );

    const { container } = await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(getGrantButton()).toBeDisabled();
    expect(container.querySelector(".mt-button__loader")).toBeInTheDocument();

    // ACT
    resolveGrant();
    await flushPromises();

    // ASSERT
    expect(getGrantButton()).toBeEnabled();
  });

  it("blocks a second permission request while the first one runs", async () => {
    // ARRANGE
    const user = userEvent.setup();
    grant.mockReturnValue(new Promise<void>(() => {}));

    await renderBanner();

    // ACT
    const grantButton = getGrantButton();
    await user.click(grantButton);
    await user.click(grantButton);

    // ASSERT
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("recovers from a failed permission request", async () => {
    // ARRANGE
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    grant.mockRejectedValue(new Error("permission denied"));

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(consoleError).toHaveBeenCalled();
    expect(getGrantButton()).toBeEnabled();

    // ACT
    grant.mockResolvedValue(undefined);
    await user.click(getGrantButton());

    // ASSERT
    expect(grant).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
  });

  it("opens the more info target in a new tab", async () => {
    // ARRANGE
    await renderBanner();

    // ASSERT
    const link = screen.getByRole("link", { name: "More info" });
    expect(link).toHaveAttribute("href", "https://www.shopware.com/en/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
