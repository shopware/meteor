import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtContainer from "./mt-container.vue";

describe("mt-container", () => {
  it.each([
    [undefined, "m"],
    ["s", "s"],
    ["l", "l"],
  ] as const)("limits the width %s to %s", (width, expected) => {
    // ACT
    render(MtContainer, { props: { width }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content")).toHaveClass(`mt-container--width-${expected}`);
  });

  it("renders as the given element", () => {
    // ACT
    render(MtContainer, { props: { as: "section" }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content").tagName).toBe("SECTION");
  });
});
