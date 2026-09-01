import { describe, it, expect, vi, afterEach } from "vitest";
import { createI18n } from "vue-i18n";
import { createVueI18nAdapter, type VueI18nLike } from "./vue-i18n";

/**
 * Integration tests against the REAL vue-i18n (devDependency, currently the v11 line) —
 * the hand-mocked spec next door cannot catch behavior that lives inside vue-i18n itself
 * (message-compiler throws, escapeParameter mutation, te() semantics, missing handlers).
 */

// Loosely typed on purpose: vue-i18n's createI18n generics infer `legacy` from the object
// literal and would otherwise type the spread result as a legacy instance.
function realComposer(options: Record<string, unknown>): VueI18nLike {
  return createI18n({
    legacy: false,
    missingWarn: false,
    fallbackWarn: false,
    ...options,
  }) as unknown as VueI18nLike;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createVueI18nAdapter × real vue-i18n", () => {
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

  it("documents the dotted-key semantics for NESTED catalogs (flat catalogs need >= 11.3 or skipExistenceCheck)", () => {
    const i18n = realComposer({
      locale: "en",
      messages: { en: { mt: { pagination: { nextPage: "Next page" } } } },
    });

    expect(createVueI18nAdapter(i18n).t("mt.pagination.nextPage")).toBe("Next page");
  });

  it("degrades a host override with unescaped special characters to a miss instead of crashing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const i18n = realComposer({
      locale: "en",
      messages: { en: { mt: { card: { contact: "support@shopware.com" } } } },
    });

    const adapter = createVueI18nAdapter(i18n);

    // `@` is vue-i18n's linked-message sigil; depending on the vue-i18n version this
    // either compiles to something else or throws. Either way the adapter must not
    // crash the render — a throw becomes a miss (undefined) with a dev warning.
    expect(() => adapter.t("mt.card.contact")).not.toThrow();
    warn.mockRestore();
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
      missingWarn: false,
      fallbackWarn: false,
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
    warn.mockRestore();
  });
});
