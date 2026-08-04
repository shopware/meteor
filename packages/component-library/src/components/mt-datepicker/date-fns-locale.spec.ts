import { describe, expect, it } from "vitest";
import { de } from "date-fns/locale/de";
import { enGB } from "date-fns/locale/en-GB";
import { importDateFnsLocaleModule, resolveDateFnsLocaleModule } from "./date-fns-locale";

describe("date-fns locale resolver", () => {
  it("imports valid locale paths", async () => {
    await expect(importDateFnsLocaleModule("de")).resolves.toBe(de);
    await expect(importDateFnsLocaleModule("en-GB")).resolves.toBe(enGB);
  });

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

  it("rejects unsafe locale import paths", async () => {
    await expect(importDateFnsLocaleModule("../format")).resolves.toBeNull();
    await expect(importDateFnsLocaleModule("en/US")).resolves.toBeNull();
  });
});
