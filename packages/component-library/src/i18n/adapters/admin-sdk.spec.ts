import { describe, it, expect, vi, beforeEach } from "vitest";
import { computed, type Ref } from "vue";

const { mockGetLocale, mockSubscribeLocale } = vi.hoisted(() => ({
  mockGetLocale: vi.fn(),
  mockSubscribeLocale: vi.fn(),
}));

vi.mock("@shopware-ag/meteor-admin-sdk/es/context", () => ({
  getLocale: mockGetLocale,
  subscribeLocale: mockSubscribeLocale,
}));

import { createAdminSdkAdapter } from "./admin-sdk";

describe("createAdminSdkAdapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetLocale.mockResolvedValue({ locale: "de-DE", fallbackLocale: "en-GB" });
  });

  it("awaits the initial host locale before resolving", async () => {
    const adapter = await createAdminSdkAdapter();

    expect(mockGetLocale).toHaveBeenCalledOnce();
    expect((adapter.locale as Ref<string>).value).toBe("de-DE");
  });

  it("updates the locale reactively when the host pushes a change", async () => {
    const adapter = await createAdminSdkAdapter();
    const observed = computed(() => (adapter.locale as Ref<string>).value);

    expect(observed.value).toBe("de-DE");

    const pushLocale = mockSubscribeLocale.mock.calls[0][0];
    pushLocale({ locale: "en-GB", fallbackLocale: "en-GB" });

    expect(observed.value).toBe("en-GB");
  });

  it("always misses on t so Meteor's bundled snippets translate", async () => {
    const adapter = await createAdminSdkAdapter();

    expect(adapter.t("mt.pagination.firstPage")).toBeUndefined();
  });
});
