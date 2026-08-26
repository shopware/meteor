import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCan,
  mockCompareIsShopwareVersion,
  mockGrant,
  mockIsGranted,
  mockIsService,
  mockRouterPush,
} = vi.hoisted(() => ({
  mockCan: vi.fn(),
  mockCompareIsShopwareVersion: vi.fn(),
  mockGrant: vi.fn(),
  mockIsGranted: vi.fn(),
  mockIsService: vi.fn(),
  mockRouterPush: vi.fn(),
}));

vi.mock("@shopware-ag/meteor-admin-sdk", () => ({
  context: {
    can: mockCan,
    compareIsShopwareVersion: mockCompareIsShopwareVersion,
  },
  _private: {
    context: {
      isService: mockIsService,
    },
    permissions: {
      grant: mockGrant,
      isGranted: mockIsGranted,
    },
  },
  window: {
    routerPush: mockRouterPush,
  },
}));

describe("useServicePermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCompareIsShopwareVersion.mockResolvedValue(false);
    mockIsService.mockResolvedValue(false);
  });

  async function mountHarness(waitForAsyncState = true) {
    const module = await import("./useServicePermission");
    let api: ReturnType<typeof module.useServicePermission> | null = null;

    const Harness = defineComponent({
      setup() {
        api = module.useServicePermission();
        return () => h("div");
      },
    });

    const wrapper = mount(Harness);
    if (waitForAsyncState) {
      await vi.waitFor(() => {
        expect(api!.isLegacySWVersionEvaluating.value).toBe(false);
      });
      await flushPromises();
    }

    return { api: api!, wrapper };
  }

  it("uses the legacy permission on Shopware versions before 6.7.14.0", async () => {
    mockCompareIsShopwareVersion.mockResolvedValue(true);
    mockCan.mockResolvedValue(true);

    const { api, wrapper } = await mountHarness();

    expect(mockCompareIsShopwareVersion).toHaveBeenCalledWith("<", "6.7.14.0");
    expect(mockCan).toHaveBeenCalledWith("system_config:read");
    expect(api.permissionGranted.value).toBe(true);
    expect(api.isLegacySWVersion.value).toBe(true);
    expect(api.isLegacySWVersionEvaluating.value).toBe(false);
    expect(api.isShowPermissionUI.value).toBe(true);

    wrapper.unmount();
  });

  it("uses the private permission API on Shopware 6.7.14.0 and later", async () => {
    mockIsGranted.mockResolvedValue(true);

    const { api, wrapper } = await mountHarness();

    expect(mockCompareIsShopwareVersion).toHaveBeenCalledWith("<", "6.7.14.0");
    expect(mockIsGranted).toHaveBeenCalledOnce();
    expect(mockCan).not.toHaveBeenCalled();
    expect(api.permissionGranted.value).toBe(true);
    expect(api.isLegacySWVersion.value).toBe(false);
    expect(api.isLegacySWVersionEvaluating.value).toBe(false);

    wrapper.unmount();
  });

  it("exposes whether the current extension is a Shopware Service", async () => {
    mockIsService.mockResolvedValue(true);
    mockIsGranted.mockResolvedValue(false);

    const { api, wrapper } = await mountHarness();

    expect(mockIsService).toHaveBeenCalledOnce();
    expect(api.isService.value).toBe(true);
    expect(api.isShowPermissionUI.value).toBe(true);

    wrapper.unmount();
  });

  it("does not call the unsupported service context API on legacy versions", async () => {
    mockCompareIsShopwareVersion.mockResolvedValue(true);

    const { api, wrapper } = await mountHarness();

    expect(mockIsService).not.toHaveBeenCalled();
    expect(api.isService.value).toBe(false);

    wrapper.unmount();
  });

  it("uses null when the Shopware version cannot be resolved", async () => {
    mockCompareIsShopwareVersion.mockRejectedValueOnce(new Error("Version unavailable"));

    const { api, wrapper } = await mountHarness();

    expect(api.isLegacySWVersion.value).toBeNull();
    expect(api.isLegacySWVersionEvaluating.value).toBe(false);
    expect(api.isService.value).toBe(false);
    expect(api.permissionGranted.value).toBeNull();
    expect(api.isShowPermissionUI.value).toBe(false);
    expect(mockIsService).not.toHaveBeenCalled();
    expect(mockIsGranted).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("keeps permissionGranted false when permission is denied", async () => {
    mockIsGranted.mockResolvedValue(false);

    const { api, wrapper } = await mountHarness();

    expect(api.permissionGranted.value).toBe(false);

    wrapper.unmount();
  });

  it("uses null when the permission state cannot be resolved", async () => {
    mockIsGranted.mockRejectedValueOnce(new Error("Permission unavailable"));

    const { api, wrapper } = await mountHarness();

    expect(api.permissionGranted.value).toBeNull();

    wrapper.unmount();
  });

  it("opens the Shopware Services page when granting on versions before 6.7.14.0", async () => {
    mockCompareIsShopwareVersion.mockResolvedValue(true);

    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(mockRouterPush).toHaveBeenCalledWith({ path: "/sw/settings/services/index" });
    expect(mockGrant).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("grants service permissions through the private API on 6.7.14.0 and later", async () => {
    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(mockGrant).toHaveBeenCalledOnce();
    expect(mockRouterPush).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("returns without granting while the Shopware version is evaluating", async () => {
    let resolveVersion!: (isLegacy: boolean) => void;
    mockCompareIsShopwareVersion.mockImplementationOnce(
      () =>
        new Promise<boolean>((resolve) => {
          resolveVersion = resolve;
        }),
    );

    const { api, wrapper } = await mountHarness(false);

    const grantPromise = api.grant();
    await flushPromises();

    resolveVersion(false);
    await grantPromise;
    await flushPromises();

    expect(mockGrant).not.toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("resolves the Shopware version once per composable instance", async () => {
    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(mockCompareIsShopwareVersion).toHaveBeenCalledOnce();

    wrapper.unmount();
  });

  it("exposes loading state and ignores duplicate grant requests", async () => {
    let resolveGrant!: () => void;
    mockGrant.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveGrant = resolve;
        }),
    );

    const { api, wrapper } = await mountHarness();

    const grantPromise = api.grant();
    await flushPromises();
    const duplicateGrantPromise = api.grant();
    await flushPromises();

    expect(api.isGranting.value).toBe(true);
    expect(mockGrant).toHaveBeenCalledOnce();

    resolveGrant();
    await Promise.all([grantPromise, duplicateGrantPromise]);

    expect(api.isGranting.value).toBe(false);

    wrapper.unmount();
  });

  it("resets loading state when granting fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGrant.mockRejectedValueOnce(new Error("Grant failed"));

    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(consoleError).toHaveBeenCalledWith(
      "Error granting permission:",
      new Error("Grant failed"),
    );
    expect(api.isGranting.value).toBe(false);

    consoleError.mockRestore();
    wrapper.unmount();
  });

  it("handles failures while opening the legacy Services page", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockCompareIsShopwareVersion.mockResolvedValue(true);
    mockRouterPush.mockRejectedValueOnce(new Error("Route unavailable"));

    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(consoleError).toHaveBeenCalledWith(
      "Error granting permission:",
      new Error("Route unavailable"),
    );

    consoleError.mockRestore();
    wrapper.unmount();
  });
});
