import { describe, it, expect, vi, afterEach } from "vitest";
import { ref, type Ref } from "vue";
import { createVueI18nAdapter } from "./vue-i18n";

function fakeComposer(messages: Record<string, string>, locale = ref("en-GB")) {
  return {
    locale,
    te: (key: string) => key in messages,
    t: (key: string) => messages[key] ?? key,
  };
}

/**
 * Mimics vue-i18n v9/v10: `te(key)` checks ONLY the given (or active) locale and never
 * walks the fallback chain — the exact behavior the adapter's fallback probe works around.
 */
function fakeV10Composer(
  catalogs: Record<string, Record<string, string>>,
  locale: Ref<string>,
  fallbackLocale: Ref<unknown>,
) {
  return {
    locale,
    fallbackLocale,
    te: (key: string, loc?: string) => key in (catalogs[loc ?? locale.value] ?? {}),
    t: (key: string, _named?: Record<string, unknown>, options?: { locale?: string }) =>
      catalogs[options?.locale ?? locale.value]?.[key] ?? key,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createVueI18nAdapter", () => {
  it("works with a createI18n()-style instance ({ global })", () => {
    const adapter = createVueI18nAdapter({ global: fakeComposer({ foo: "Foo!" }) });

    expect(adapter.t("foo")).toBe("Foo!");
    expect(adapter.t("missing")).toBeUndefined(); // miss -> nullish, not the key
  });

  it("works with a composer directly (@nuxtjs/i18n $i18n / useI18n())", () => {
    const adapter = createVueI18nAdapter(fakeComposer({ foo: "Foo!" }));

    expect(adapter.t("foo")).toBe("Foo!");
    expect(adapter.t("missing")).toBeUndefined();
  });

  it("exposes the composer locale reactively", () => {
    const locale = ref("de-DE");
    const adapter = createVueI18nAdapter(fakeComposer({}, locale));

    expect((adapter.locale as typeof locale).value).toBe("de-DE");
    locale.value = "en-GB";
    expect((adapter.locale as typeof locale).value).toBe("en-GB");
  });

  describe("fallback-locale probing (vue-i18n v9/v10 te() gap)", () => {
    it("resolves a key that exists only in the fallback locale", () => {
      const composer = fakeV10Composer(
        { "en-GB": { "global.error-codes.X": "English only" }, "de-DE": {} },
        ref("de-DE"),
        ref("en-GB"),
      );

      const adapter = createVueI18nAdapter(composer);

      expect(adapter.t("global.error-codes.X")).toBe("English only");
    });

    it("prefers the active locale over the fallback", () => {
      const composer = fakeV10Composer(
        { "en-GB": { greeting: "Hello" }, "de-DE": { greeting: "Hallo" } },
        ref("de-DE"),
        ref("en-GB"),
      );

      expect(createVueI18nAdapter(composer).t("greeting")).toBe("Hallo");
    });

    it("uses the first entry of an array fallbackLocale and misses cleanly otherwise", () => {
      const composer = fakeV10Composer(
        { "en-GB": { key: "from array fallback" }, "de-DE": {} },
        ref("de-DE"),
        ref(["en-GB", "en"]),
      );

      expect(createVueI18nAdapter(composer).t("key")).toBe("from array fallback");
      expect(createVueI18nAdapter(composer).t("missing")).toBeUndefined();
    });
  });

  describe("hardening against host-side failure modes", () => {
    it("degrades to a miss (with a dev warning) when the host t() throws", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const composer = {
        locale: ref("en"),
        te: () => true,
        t: () => {
          // vue-i18n >= 11.3 throws message-compiler SyntaxErrors at t() time.
          throw new SyntaxError("Invalid linked format");
        },
      };

      const adapter = createVueI18nAdapter(composer);

      expect(adapter.t("mt.card.title")).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("could not be compiled"), expect.any(SyntaxError));
    });

    it("does not let the host mutate the caller's values object", () => {
      // vue-i18n's escapeParameter option mutates options.named in place.
      const composer = {
        locale: ref("en"),
        te: () => true,
        t: (_key: string, named?: Record<string, unknown>) => {
          if (named) named.name = "MUTATED";
          return "hit";
        },
      };
      const values = { name: "original" };

      createVueI18nAdapter(composer).t("key", values);

      expect(values.name).toBe("original");
    });

    it("warns when handed a legacy-mode instance (locale is not a ref)", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const legacyLike = {
        locale: "en",
        te: () => false,
        t: (key: string) => key,
      };

      createVueI18nAdapter(legacyLike as never);

      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Composition-mode composer"));
    });
  });

  describe("skipExistenceCheck option", () => {
    it("resolves translations te() cannot see (e.g. a missing handler) and treats key-echo as a miss", () => {
      const backendCatalog: Record<string, string> = {
        "mt.pagination.nextPage": "From the backend",
      };
      const composer = {
        locale: ref("en"),
        // te() knows nothing — the translations only materialize through t().
        te: () => false,
        t: (key: string) => backendCatalog[key] ?? key,
      };

      const adapter = createVueI18nAdapter(composer, { skipExistenceCheck: true });

      expect(adapter.t("mt.pagination.nextPage")).toBe("From the backend");
      expect(adapter.t("mt.pagination.firstPage")).toBeUndefined(); // key echo -> miss
    });
  });

  describe("legacyKeys option", () => {
    it("retries mt.<x>.<rest> as mt-<x>.<rest> and warns once in dev", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const composer = fakeComposer({ "mt-text-editor-toolbar-button-link.label": "リンク" });

      const adapter = createVueI18nAdapter(composer, { legacyKeys: true });

      expect(adapter.t("mt.text-editor-toolbar-button-link.label")).toBe("リンク");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("deprecated key name"));
    });

    it("does not probe legacy names when the option is off", () => {
      const composer = fakeComposer({ "mt-field-error.INVALID_MAIL": "old override" });

      const adapter = createVueI18nAdapter(composer);

      expect(adapter.t("mt.field-error.INVALID_MAIL")).toBeUndefined();
    });

    it("prefers the new key name over the legacy one", () => {
      const composer = fakeComposer({
        "mt.field-error.INVALID_MAIL": "new",
        "mt-field-error.INVALID_MAIL": "old",
      });

      const adapter = createVueI18nAdapter(composer, { legacyKeys: true });

      expect(adapter.t("mt.field-error.INVALID_MAIL")).toBe("new");
    });
  });
});
