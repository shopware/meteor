import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { createVueI18nAdapter } from "./vue-i18n";

function fakeComposer(messages: Record<string, string>, locale = ref("en-GB")) {
  return {
    locale,
    te: (key: string) => key in messages,
    t: (key: string) => messages[key] ?? key,
  };
}

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
});
