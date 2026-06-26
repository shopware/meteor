import { describe, it, expect } from "vitest";
import { languageOf, localeChain } from "./locale";

describe("languageOf", () => {
  it("returns the lowercased language part", () => {
    expect(languageOf("en")).toBe("en");
    expect(languageOf("de-DE")).toBe("de");
    expect(languageOf("de_AT")).toBe("de");
    expect(languageOf("EN-GB")).toBe("en");
  });

  it("falls back to English for empty input", () => {
    expect(languageOf(undefined)).toBe("en");
    expect(languageOf(null)).toBe("en");
    expect(languageOf("")).toBe("en");
  });
});

describe("localeChain", () => {
  it("builds region -> language -> English", () => {
    expect(localeChain("de-DE")).toEqual(["de-DE", "de", "en"]);
    expect(localeChain("de-CH")).toEqual(["de-CH", "de", "en"]);
    expect(localeChain("en-US")).toEqual(["en-US", "en"]);
    expect(localeChain("fr-FR")).toEqual(["fr-FR", "fr", "en"]);
  });

  it("deduplicates when there is no region", () => {
    expect(localeChain("de")).toEqual(["de", "en"]);
    expect(localeChain("en")).toEqual(["en"]);
  });

  it("falls back to English for empty input", () => {
    expect(localeChain(undefined)).toEqual(["en"]);
    expect(localeChain("")).toEqual(["en"]);
  });
});
