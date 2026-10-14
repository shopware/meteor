import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtContentLayout from "./mt-content-layout.vue";

describe("mt-content-layout", () => {
  it("renders the content without sidebars", () => {
    // ACT
    const { container } = render(MtContentLayout, { slots: { default: "Content" } });

    // ASSERT
    expect(screen.getByText("Content")).toHaveClass("mt-content-layout__content");
    expect(container.querySelector(".mt-content-layout__sidebar")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveClass("mt-content-layout--start");
    expect(container.firstElementChild).not.toHaveClass("mt-content-layout--end");
  });

  it.each([[["start"]], [["end"]], [["start", "end"]]] as const)(
    "places the %j sidebars next to the content",
    (sides) => {
      // ACT
      const { container } = render(MtContentLayout, {
        slots: {
          default: "Content",
          ...Object.fromEntries(sides.map((side) => [side, `Sidebar ${side}`])),
        },
      });

      // ASSERT
      sides.forEach((side) => {
        expect(screen.getByText(`Sidebar ${side}`)).toHaveClass(
          "mt-content-layout__sidebar",
          `mt-content-layout__sidebar--${side}`,
        );
        expect(container.firstElementChild).toHaveClass(`mt-content-layout--${side}`);
      });
      expect(container.querySelectorAll(".mt-content-layout__sidebar")).toHaveLength(sides.length);
    },
  );

  it("renders no sidebar for a slot without content", () => {
    // ACT
    const { container } = render(MtContentLayout, {
      slots: { default: "Content", start: '<span v-if="false">Sidebar</span>' },
    });

    // ASSERT
    expect(container.querySelector(".mt-content-layout__sidebar")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveClass("mt-content-layout--start");
  });
});
