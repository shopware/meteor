import { describe, it, expect } from "vitest";
import { defineComponent, h, ref, type Plugin } from "vue";
import { mount } from "@vue/test-utils";
import {
  useMeteorI18n,
  type MeteorI18nComposer,
  type UseMeteorI18nOptions,
} from "./use-meteor-i18n";
import { createMeteorI18nPlugin } from "@/i18n/plugin";
import { defaultMeteorI18n } from "@/i18n/injection";
import type { MeteorI18nAdapter } from "@/i18n/types";

// A component with a namespace + short bundled keys (the common case).
const paginationOptions: UseMeteorI18nOptions = {
  namespace: "mt.pagination",
  messages: {
    en: { firstPage: "First page", infoText: "{start}-{end} of {totalItems}" },
    de: { firstPage: "Erste Seite", infoText: "{start}-{end} von {totalItems}" },
  },
};

function setupComposable(plugin?: Plugin, options: UseMeteorI18nOptions = paginationOptions) {
  let composer!: MeteorI18nComposer;
  mount(
    defineComponent({
      setup() {
        composer = useMeteorI18n(options);
        return () => h("div");
      },
    }),
    { global: { plugins: plugin ? [plugin] : [] } },
  );
  return composer;
}

describe("useMeteorI18n", () => {
  it("renders bundled English snippets via the namespace, with interpolation", () => {
    const { t } = setupComposable(createMeteorI18nPlugin());

    expect(t("firstPage")).toBe("First page");
    expect(t("infoText", { start: 1, end: 25, totalItems: 213 })).toBe("1-25 of 213");
  });

  it("returns the public (namespaced) key for an unknown snippet", () => {
    const { t } = setupComposable(createMeteorI18nPlugin());

    expect(t("missing")).toBe("mt.pagination.missing");
  });

  it("switches language via the writable locale and uses the fallback chain (de bundled)", () => {
    const { t, locale } = setupComposable(createMeteorI18nPlugin({ locale: "de-DE" }));

    expect(locale.value).toBe("de");
    expect(t("firstPage")).toBe("Erste Seite");
  });

  it("lets the override registry beat the bundled snippet", () => {
    const plugin = createMeteorI18nPlugin({
      messages: { en: { mt: { pagination: { firstPage: "Start" } } } },
    });
    const { t } = setupComposable(plugin);

    expect(t("firstPage")).toBe("Start");
  });

  it("supports region-specific overrides (en-US) that fall back to the language default", () => {
    const adapter: MeteorI18nAdapter = { locale: ref("en-US"), t: () => undefined };
    const plugin = createMeteorI18nPlugin({
      adapter,
      messages: { "en-US": { mt: { pagination: { firstPage: "First (US)" } } } },
    });
    const { t } = setupComposable(plugin);

    // en-US override wins for firstPage; infoText has no en-US override -> falls to bundled en.
    expect(t("firstPage")).toBe("First (US)");
    expect(t("infoText", { start: 1, end: 2, totalItems: 3 })).toBe("1-2 of 3");
  });

  it("prefers a host adapter hit over registry and bundled", () => {
    const adapter: MeteorI18nAdapter = {
      locale: ref("en-GB"),
      t: (key) => (key === "mt.pagination.firstPage" ? "Host first page" : undefined),
    };
    const { t } = setupComposable(createMeteorI18nPlugin({ adapter }));

    expect(t("firstPage")).toBe("Host first page");
  });

  it("normalizes the host adapter locale (de-DE -> de) for bundled lookup", () => {
    const adapter: MeteorI18nAdapter = { locale: ref("de-DE"), t: () => undefined };
    const { t, locale } = setupComposable(createMeteorI18nPlugin({ adapter }));

    expect(locale.value).toBe("de");
    expect(t("firstPage")).toBe("Erste Seite");
  });

  describe("without a namespace (fully-qualified keys, e.g. host passthrough)", () => {
    const fieldErrorOptions: UseMeteorI18nOptions = {
      messages: {
        en: { mt: { "field-error": { INVALID_MAIL: "Please enter a valid email address." } } },
      },
    };

    it("resolves a fully-qualified bundled key", () => {
      const { t } = setupComposable(createMeteorI18nPlugin(), fieldErrorOptions);
      expect(t("mt.field-error.INVALID_MAIL")).toBe("Please enter a valid email address.");
    });

    it("returns the key verbatim on a miss (=== key detection)", () => {
      const { t } = setupComposable(createMeteorI18nPlugin(), fieldErrorOptions);
      expect(t("global.error-codes.UNKNOWN")).toBe("global.error-codes.UNKNOWN");
    });
  });

  it("exposes a default instance so components work with no provider", () => {
    expect(defaultMeteorI18n.adapter).toBeUndefined();
    expect(defaultMeteorI18n.fallbackLocale.value).toBe("en");
  });
});
