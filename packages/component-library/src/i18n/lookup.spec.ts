import { describe, it, expect } from "vitest";
import { lookupNested } from "./lookup";

describe("lookupNested", () => {
  const tree = {
    "flat.dotted.key": "flat value",
    nested: { deep: { key: "nested value" }, notALeaf: { x: "y" } },
  };

  it("resolves a literal dotted key as the fast path", () => {
    expect(lookupNested(tree, "flat.dotted.key")).toBe("flat value");
  });

  it("walks nested paths", () => {
    expect(lookupNested(tree, "nested.deep.key")).toBe("nested value");
  });

  it("returns undefined for missing paths and non-string leaves", () => {
    expect(lookupNested(tree, "nested.missing")).toBeUndefined();
    expect(lookupNested(tree, "nested.notALeaf")).toBeUndefined();
    expect(lookupNested(undefined, "anything")).toBeUndefined();
  });

  it("does not traverse prototype properties", () => {
    expect(lookupNested(tree, "__proto__.constructor")).toBeUndefined();
    expect(lookupNested(tree, "nested.constructor.name")).toBeUndefined();
  });
});
