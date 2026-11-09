import { describe, expect, it } from "vitest";
import { de } from "date-fns/locale/de";
import { enGB } from "date-fns/locale/en-GB";
import { importDateFnsLocale } from "./date-fns-locale";

describe("date-fns locale loader", () => {
  it("loads locales by their path", async () => {
    await expect(importDateFnsLocale("de")).resolves.toBe(de);
    await expect(importDateFnsLocale("en-GB")).resolves.toBe(enGB);
  });

  it("returns null for paths that aren't date-fns locales", async () => {
    await expect(importDateFnsLocale("xx")).resolves.toBeNull();
    await expect(importDateFnsLocale("../format")).resolves.toBeNull();
    await expect(importDateFnsLocale("constructor")).resolves.toBeNull();
  });
});
