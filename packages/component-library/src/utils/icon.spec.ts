import { parseIconName, resolveIconName } from "./icon";

describe("parseIconName", () => {
  it.each([
    ["solid-cog", { mode: "solid", name: "cog" }],
    ["regular-cog", { mode: "regular", name: "cog" }],
    ["regular-times-s", { mode: "regular", name: "times-s" }],
    ["solid-exclamation-circle", { mode: "solid", name: "exclamation-circle" }],
  ])("takes the style from %s", (input, expected) => {
    expect(parseIconName(input)).toEqual(expected);
  });

  it("uses the fallback style for a name without one", () => {
    expect(parseIconName("cog")).toEqual({ mode: "regular", name: "cog" });
    expect(parseIconName("cog", "solid")).toEqual({ mode: "solid", name: "cog" });
  });

  it("keeps names that only start like a style", () => {
    expect(parseIconName("solid", "solid")).toEqual({ mode: "solid", name: "solid" });
  });
});

describe("resolveIconName", () => {
  it.each(["cog", "regular-cog", "solid-cog"])("gives %s the solid style", (name) => {
    expect(resolveIconName(name, "solid")).toBe("solid-cog");
  });

  it("keeps size suffixes", () => {
    expect(resolveIconName("solid-times-s", "regular")).toBe("regular-times-s");
  });
});
