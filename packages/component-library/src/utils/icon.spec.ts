import { parseIconName } from "./icon";

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
