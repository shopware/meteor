import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import flushPromises from "flush-promises";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

const isService = vi.hoisted(() => vi.fn());
const grant = vi.hoisted(() => vi.fn());
const isGranted = vi.hoisted(() => vi.fn());

vi.mock("@shopware-ag/meteor-admin-sdk/es/_private/context", () => ({ isService }));
vi.mock("@shopware-ag/meteor-admin-sdk/es/_private/permissions", () => ({ grant, isGranted }));

/**
 * Renders the banner and waits for the `isService` round-trip to settle, because
 * the banner stays hidden until the Administration confirms a service context.
 */
async function renderBanner() {
  const result = render(MtGrantPermissionServiceBanner);
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
  isGranted.mockResolvedValue(false);
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

  it("renders nothing when the permission has already been granted", async () => {
    // ARRANGE
    isGranted.mockResolvedValue(true);

    // ACT
    await renderBanner();

    // ASSERT
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders nothing when the granted state can not be resolved", async () => {
    // ARRANGE
    isGranted.mockRejectedValue(new Error("no channel counterpart"));

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

  it("sizes itself against a query container instead of a layout prop", async () => {
    // ARRANGE
    const { container } = await renderBanner();

    // ASSERT
    expect(screen.getByRole("region").parentElement).toHaveClass(
      "mt-grant-permission-service-banner__container",
    );
    expect(container.querySelector("[class*='mt-grant-permission-service-banner--']")).toBeNull();
  });

  it("renders both grant labels so the container query can pick one", async () => {
    // ARRANGE
    await renderBanner();

    // ASSERT
    const grantButton = getGrantButton();
    expect(
      grantButton.querySelector(".mt-grant-permission-service-banner__label--short"),
    ).toHaveTextContent("Grant permission");
    expect(
      grantButton.querySelector(".mt-grant-permission-service-banner__label--long"),
    ).toHaveTextContent("Grant permission and activate");
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
    expect(link).toHaveAttribute(
      "href",
      "https://docs.shopware.com/en/shopware-6-en/shopware-services",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
