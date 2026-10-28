import { describe, it, expect, vi, afterEach } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { render } from "@testing-library/vue";
import { createI18n as createI18nV11 } from "vue-i18n";
import { createI18n as createI18nV10 } from "vue-i18n-v10";
import { createVueI18nAdapter, type VueI18nLike, type VueI18nAdapterOptions } from "./vue-i18n";
import { createMeteorI18nPlugin } from "../plugin";
import { useMeteorI18n } from "@/composables/useMeteorI18n";

/**
 * Integration tests against the REAL vue-i18n, in both lines Meteor's consumers use: v11
 * (current) and v10 (the Shopware Administration). The hand-mocked spec next door cannot
 * catch behavior that lives inside vue-i18n itself (message-compiler throws,
 * escapeParameter mutation, te() semantics, missing handlers).
 */

type CreateI18n = (options: Record<string, unknown>) => unknown;

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each([
  ["vue-i18n 11", createI18nV11 as unknown as CreateI18n],
  ["vue-i18n 10", createI18nV10 as unknown as CreateI18n],
])("createVueI18nAdapter × %s", (_version, createI18n) => {
  // Loosely typed on purpose: vue-i18n's createI18n generics infer `legacy` from the object
  // literal and would otherwise type the spread result as a legacy instance.
  function realComposer(options: Record<string, unknown>): VueI18nLike {
    return createI18n({
      legacy: false,
      missingWarn: false,
      fallbackWarn: false,
      ...options,
    }) as VueI18nLike;
  }

  // A Meteor component with bundled en/de snippets, rendered under the plugin + adapter.
  function renderPagination(i18n: VueI18nLike, adapterOptions?: VueI18nAdapterOptions) {
    const { container } = render(
      defineComponent({
        setup() {
          const { t } = useMeteorI18n({
            namespace: "mt.pagination",
            messages: {
              en: { nextPage: "Next page" },
              de: { nextPage: "Nächste Seite" },
            },
          });
          return () => h("span", t("nextPage"));
        },
      }),
      {
        global: {
          plugins: [
            createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n, adapterOptions) }),
          ],
        },
      },
    );
    return container;
  }

  it("resolves hits, misses to undefined, and probes the fallback locale", () => {
    const i18n = realComposer({
      locale: "de-DE",
      fallbackLocale: "en-GB",
      messages: {
        "de-DE": { mt: { card: { hit: "Treffer" } } },
        "en-GB": { mt: { card: { fallbackOnly: "english only" } } },
      },
    });

    const adapter = createVueI18nAdapter(i18n);

    expect(adapter.t("mt.card.hit")).toBe("Treffer");
    expect(adapter.t("mt.card.fallbackOnly")).toBe("english only");
    expect(adapter.t("mt.card.missing")).toBeUndefined();
  });

  it("looks only in the requested locale when one is passed", () => {
    const i18n = realComposer({
      locale: "de-DE",
      fallbackLocale: "en-GB",
      messages: {
        "de-DE": { mt: { card: { hit: "Treffer" } } },
        "en-GB": { mt: { card: { fallbackOnly: "english only" } } },
      },
    });

    const adapter = createVueI18nAdapter(i18n);

    expect(adapter.t("mt.card.hit", undefined, { locale: "de-DE" })).toBe("Treffer");
    expect(adapter.t("mt.card.fallbackOnly", undefined, { locale: "de-DE" })).toBeUndefined();
    expect(adapter.t("mt.card.fallbackOnly", undefined, { locale: "en-GB" })).toBe("english only");
  });

  it("documents the dotted-key semantics for NESTED catalogs (flat catalogs need >= 11.3 or skipExistenceCheck)", () => {
    const i18n = realComposer({
      locale: "en",
      messages: { en: { mt: { pagination: { nextPage: "Next page" } } } },
    });

    expect(createVueI18nAdapter(i18n).t("mt.pagination.nextPage")).toBe("Next page");
  });

  it("degrades a host override with unescaped special characters to a miss instead of crashing", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const i18n = realComposer({
      locale: "en",
      messages: { en: { mt: { card: { contact: "support@shopware.com" } } } },
    });

    const adapter = createVueI18nAdapter(i18n);

    // `@` is vue-i18n's linked-message sigil; depending on the vue-i18n version this
    // either compiles to something else or throws. Either way the adapter must not
    // crash the render — a throw becomes a miss (undefined) with a dev warning.
    expect(() => adapter.t("mt.card.contact")).not.toThrow();
  });

  it("does not let escapeParameter mutate the caller's values object", () => {
    const i18n = realComposer({
      locale: "en",
      escapeParameter: true,
      messages: { en: { mt: { card: { greeting: "Hello {name}" } } } },
    });
    const values = { name: "Q&A <team>" };

    createVueI18nAdapter(i18n).t("mt.card.greeting", values);

    expect(values.name).toBe("Q&A <team>");
  });

  it("selects plural forms from named n through the adapter", () => {
    const i18n = realComposer({
      locale: "en",
      messages: { en: { mt: { table: { rows: "no rows | one row | {n} rows" } } } },
    });

    const adapter = createVueI18nAdapter(i18n);

    expect(adapter.t("mt.table.rows", { n: 0 })).toBe("no rows");
    expect(adapter.t("mt.table.rows", { n: 1 })).toBe("one row");
    expect(adapter.t("mt.table.rows", { n: 7 })).toBe("7 rows");
  });

  it("skipExistenceCheck resolves translations served by a missing handler", () => {
    const backend: Record<string, string> = { "mt.pagination.nextPage": "From the backend" };
    const i18n = realComposer({
      locale: "en",
      messages: { en: {} },
      missing: (_locale: string, key: string) => backend[key],
    });

    const gated = createVueI18nAdapter(i18n);
    const trusting = createVueI18nAdapter(i18n, { skipExistenceCheck: true });

    // te() never consults the missing handler — the gated adapter cannot see it.
    expect(gated.t("mt.pagination.nextPage")).toBeUndefined();
    expect(trusting.t("mt.pagination.nextPage")).toBe("From the backend");
    expect(trusting.t("mt.pagination.unknown")).toBeUndefined(); // key echo -> miss
  });

  it("warns when handed a real legacy-mode instance", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const i18n = createI18n({ legacy: true, locale: "en", messages: { en: {} } });

    createVueI18nAdapter(i18n as never);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Composition-mode composer"));
  });

  describe("inside a Meteor component", () => {
    it("keeps Meteor's German when the host overrides a Meteor text only in its fallback language", () => {
      const i18n = realComposer({
        locale: "de-DE",
        fallbackLocale: "en-GB",
        messages: { "de-DE": {}, "en-GB": { mt: { pagination: { nextPage: "Forward" } } } },
      });

      expect(renderPagination(i18n).textContent).toBe("Nächste Seite");
    });

    it("uses the host's override in the language it was written for", () => {
      const i18n = realComposer({
        locale: "en-GB",
        fallbackLocale: "en-GB",
        messages: { "en-GB": { mt: { pagination: { nextPage: "Forward" } } } },
      });

      expect(renderPagination(i18n).textContent).toBe("Forward");
    });

    it("uses the host's fallback-language text for a language Meteor doesn't ship", () => {
      const i18n = realComposer({
        locale: "fr-FR",
        fallbackLocale: "en-GB",
        messages: { "fr-FR": {}, "en-GB": { mt: { pagination: { nextPage: "Forward" } } } },
      });

      expect(renderPagination(i18n).textContent).toBe("Forward");
    });

    it("prefers a legacy key in the active language over the new key in the fallback language", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      const i18n = realComposer({
        locale: "de-DE",
        fallbackLocale: "en-GB",
        messages: {
          "de-DE": { "mt-pagination": { nextPage: "Weiter" } },
          "en-GB": { mt: { pagination: { nextPage: "Forward" } } },
        },
      });

      expect(renderPagination(i18n, { legacyKeys: true }).textContent).toBe("Weiter");
    });

    it("re-renders when the host switches its language", async () => {
      const i18n = realComposer({ locale: "en-GB", fallbackLocale: "en-GB", messages: {} });
      const container = renderPagination(i18n);

      expect(container.textContent).toBe("Next page");

      i18n.global.locale.value = "de-DE";
      await nextTick();

      expect(container.textContent).toBe("Nächste Seite");
    });

    it("re-renders when the host adds messages after mount", async () => {
      const i18n = realComposer({ locale: "de-DE", fallbackLocale: "en-GB", messages: {} });
      const container = renderPagination(i18n);

      expect(container.textContent).toBe("Nächste Seite");

      (
        i18n.global as unknown as { setLocaleMessage: (locale: string, messages: unknown) => void }
      ).setLocaleMessage("de-DE", { mt: { pagination: { nextPage: "Weiter" } } });
      await nextTick();

      expect(container.textContent).toBe("Weiter");
    });
  });
});
