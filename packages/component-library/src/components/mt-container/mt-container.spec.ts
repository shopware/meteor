import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtContainer from "./mt-container.vue";

describe("mt-container", () => {
  it("renders its content", () => {
    // ACT
    render(MtContainer, { slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content")).toBeVisible();
  });

  it("uses the medium width by default", () => {
    // ACT
    render(MtContainer, { slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content")).toHaveClass("mt-container--size-m");
  });

  it.each(["s", "m", "l"] as const)("limits the width to size %s", (size) => {
    // ACT
    render(MtContainer, { props: { size }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content")).toHaveClass(`mt-container--size-${size}`);
  });

  it("renders as the given element", () => {
    // ACT
    render(MtContainer, { props: { as: "section" }, slots: { default: "Page content" } });

    // ASSERT
    expect(screen.getByText("Page content").tagName).toBe("SECTION");
  });
});
