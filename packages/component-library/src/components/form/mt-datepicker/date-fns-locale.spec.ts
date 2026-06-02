import { describe, expect, it } from "vitest";
import { de } from "date-fns/locale/de";
import { enGB } from "date-fns/locale/en-GB";
import { resolveDateFnsLocaleModule } from "./date-fns-locale";

describe("date-fns locale resolver", () => {
  it("resolves date-fns v4 named locale exports", () => {
    expect(resolveDateFnsLocaleModule("de", { de })).toBe(de);
    expect(resolveDateFnsLocaleModule("en-GB", { enGB })).toBe(enGB);
  });

  it("resolves nested default locale exports", () => {
    expect(resolveDateFnsLocaleModule("de", { default: { de } })).toBe(de);
  });

  it("resolves direct default locale exports", () => {
    expect(resolveDateFnsLocaleModule("de", { default: de })).toBe(de);
  });
});
