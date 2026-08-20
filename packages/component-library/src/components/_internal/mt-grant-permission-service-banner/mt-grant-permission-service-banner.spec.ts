import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import flushPromises from "flush-promises";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

const isService = vi.hoisted(() => vi.fn());
const grant = vi.hoisted(() => vi.fn());
const isGranted = vi.hoisted(() => vi.fn());
const compareIsShopwareVersion = vi.hoisted(() => vi.fn());
const getAppInformation = vi.hoisted(() => vi.fn());
const routerPush = vi.hoisted(() => vi.fn());
const dispatch = vi.hoisted(() => vi.fn());

// The component imports the SDK barrel, so the barrel is what gets mocked.
// Only the namespaces it actually reaches for are provided — anything else the
// component starts using will fail loudly here rather than hit the real SDK.
vi.mock("@shopware-ag/meteor-admin-sdk", () => ({
  window: { routerPush },
  context: { compareIsShopwareVersion, getAppInformation },
  telemetry: { dispatch },
  _private: {
    permissions: { grant, isGranted },
    context: { isService },
  },
}));

/**
 * Renders the banner and waits for the `isService` round-trip to settle, because
 * the banner stays hidden until the Administration confirms a service context.
 *
 * The click handler is async, so anything it rejects with lands in Vue's error
 * handler rather than in the console. The collected `errors` keep those
 * rejections assertable instead of letting them fail the run as unhandled.
 */
async function renderBanner() {
  const errors: unknown[] = [];

  const result = render(MtGrantPermissionServiceBanner, {
    global: {
      config: {
        errorHandler: (error: unknown) => {
          errors.push(error);
        },
      },
    },
  });

  await flushPromises();

  return { ...result, errors };
}

function getGrantButton() {
  return screen.getByRole("button", { name: /Grant permissions/ });
}

beforeEach(() => {
  // The mocks live at module scope, so their call history has to be dropped
  // between tests before the per-test behaviour is re-established.
  vi.clearAllMocks();

  isService.mockResolvedValue(true);
  grant.mockResolvedValue(undefined);
  isGranted.mockResolvedValue(false);
  compareIsShopwareVersion.mockResolvedValue(false);
  getAppInformation.mockResolvedValue({
    name: "SwagExample",
    version: "1.2.3",
    type: "app",
    privileges: {},
  });
  routerPush.mockResolvedValue(undefined);
  dispatch.mockResolvedValue(undefined);
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
      "Grant permissions to activate this service.",
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
    ).toHaveTextContent("Grant permissions");
    expect(
      grantButton.querySelector(".mt-grant-permission-service-banner__label--long"),
    ).toHaveTextContent("Grant permissions and activate");
  });

  it("grants the service permission when the user confirms", async () => {
    // ARRANGE
    const user = userEvent.setup();
    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(grant).toHaveBeenCalledTimes(1);
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("checks the Administration version before granting", async () => {
    // ARRANGE
    const user = userEvent.setup();
    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(compareIsShopwareVersion).toHaveBeenCalledWith("<", "6.7.14.0");
  });

  it("routes to the services settings page on an Administration without grant support", async () => {
    // ARRANGE
    const user = userEvent.setup();
    compareIsShopwareVersion.mockResolvedValue(true);

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(routerPush).toHaveBeenCalledWith({ path: "/sw/settings/services/index" });
    expect(grant).not.toHaveBeenCalled();
  });

  it("releases the loading state after routing away", async () => {
    // ARRANGE
    const user = userEvent.setup();
    compareIsShopwareVersion.mockResolvedValue(true);

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(getGrantButton()).toBeEnabled();
  });

  it("does not route away when the version check fails", async () => {
    // ARRANGE
    const user = userEvent.setup();
    compareIsShopwareVersion.mockRejectedValue(new Error("no channel counterpart"));

    const { errors } = await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(routerPush).not.toHaveBeenCalled();
    expect(grant).not.toHaveBeenCalled();
    // The version check sits outside the handler's own try/catch, so the
    // failure leaves the handler and is reported by Vue.
    expect(errors).toContainEqual(new Error("no channel counterpart"));
  });

  it("recovers when the route change is rejected", async () => {
    // ARRANGE
    const user = userEvent.setup();
    compareIsShopwareVersion.mockResolvedValue(true);
    routerPush.mockRejectedValue(new Error("unknown route"));

    const { errors } = await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(errors).toContainEqual(new Error("unknown route"));
    expect(grant).not.toHaveBeenCalled();
    // A rejected route change must not leave the button stuck in its loading
    // state, otherwise the banner becomes unusable.
    expect(getGrantButton()).toBeEnabled();
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

  it("reports the grant click to telemetry", async () => {
    // ARRANGE
    const user = userEvent.setup();
    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    expect(dispatch).toHaveBeenCalledWith({
      event: "SwagExample_grant_permission_clicked",
      data: { shopware_version: "1.2.3" },
    });
  });

  it("reports the grant click on an Administration without grant support", async () => {
    // ARRANGE
    const user = userEvent.setup();
    compareIsShopwareVersion.mockResolvedValue(true);

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    // The click is what is being measured, not whether it ended in a grant or
    // in a detour to the services settings page.
    expect(dispatch).toHaveBeenCalledWith({
      event: "SwagExample_grant_permission_clicked",
      data: { shopware_version: "1.2.3" },
    });
    expect(routerPush).toHaveBeenCalled();
  });

  it("grants the permission when the app information is unavailable", async () => {
    // ARRANGE
    const user = userEvent.setup();
    getAppInformation.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    // Telemetry metadata is nice to have; the banner still has to do its job
    // without it.
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("grants the permission when telemetry is unavailable", async () => {
    // ARRANGE
    const user = userEvent.setup();
    dispatch.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();

    // ACT
    await user.click(getGrantButton());

    // ASSERT
    // A rejected dispatch is swallowed, so it neither surfaces as an unhandled
    // rejection nor stops the grant.
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("reports the more info click to telemetry", async () => {
    // ARRANGE
    const user = userEvent.setup();
    await renderBanner();

    // ACT
    await user.click(screen.getByRole("link", { name: "More info" }));

    // ASSERT
    expect(dispatch).toHaveBeenCalledWith({
      event: "SwagExample_grant_permission_more_info",
    });
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
