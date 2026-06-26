import { describe, it, expect } from "vitest";
import { render } from "./engine";

describe("i18n engine", () => {
  describe("named interpolation", () => {
    it("replaces named placeholders", () => {
      expect(render("{start}-{end} of {totalItems}", { start: 1, end: 25, totalItems: 213 })).toBe(
        "1-25 of 213",
      );
    });

    it("leaves missing placeholders as their literal token", () => {
      expect(render("{start}-{end} of {totalItems}", { start: 1, end: 25 })).toBe(
        "1-25 of {totalItems}",
      );
    });

    it("returns the message unchanged when no values are given", () => {
      expect(render("First page")).toBe("First page");
    });
  });

  describe("pluralization (3 forms) — mt-data-table numberOfResults", () => {
    const msg = "No results found for | One result found for | {n} results found for";

    it("selects the zero form for n=0", () => {
      expect(render(msg, { n: 0 })).toBe("No results found for");
    });

    it("selects the singular form for n=1", () => {
      expect(render(msg, { n: 1 })).toBe("One result found for");
    });

    it("selects the plural form for n>1 and interpolates n", () => {
      expect(render(msg, { n: 5 })).toBe("5 results found for");
    });
  });

  describe("pluralization (2 forms) — mt-data-table itemsSelected", () => {
    const msg = "1 item selected | {n} items selected";

    it("selects the singular form for n=1", () => {
      expect(render(msg, { n: 1 })).toBe("1 item selected");
    });

    it("selects the plural form for n=0", () => {
      expect(render(msg, { n: 0 })).toBe("0 items selected");
    });

    it("selects the plural form for n>1", () => {
      expect(render(msg, { n: 12 })).toBe("12 items selected");
    });
  });

  describe("pluralization edge cases", () => {
    it("supports `count` as the plural selector", () => {
      expect(render("one | {count} many", { count: 3 })).toBe("3 many");
    });

    it("treats a missing count as singular", () => {
      expect(render("singular | plural")).toBe("singular");
    });
  });
});
