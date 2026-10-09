import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtContainer from "./mt-container.vue";

describe("mt-container", () => {
  it.each([
    [undefined, "m"],
    ["s", "s"],
    ["l", "l"],
  ] as const)("limits the width for size %s to %s", (size, expected) => {
    // ACT
    render(MtContainer, { props: { size }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content")).toHaveClass(`mt-container--size-${expected}`);
  });

  it("renders as the given element", () => {
    // ACT
    render(MtContainer, { props: { as: "section" }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content").tagName).toBe("SECTION");
  });
});
