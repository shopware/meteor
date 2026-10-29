import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtLayout from "./mt-layout.vue";

describe("mt-layout", () => {
  it("renders the content without sidebars", () => {
    // ACT
    const { container } = render(MtLayout, { slots: { default: "Content" } });

    // ASSERT
    expect(screen.getByText("Content")).toHaveClass("mt-layout__content");
    expect(container.querySelector(".mt-layout__sidebar")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveClass("mt-layout--start");
    expect(container.firstElementChild).not.toHaveClass("mt-layout--end");
  });

  it.each([[["start"]], [["end"]], [["start", "end"]]] as const)(
    "places the %j sidebars next to the content",
    (sides) => {
      // ACT
      const { container } = render(MtLayout, {
        slots: {
          default: "Content",
          ...Object.fromEntries(sides.map((side) => [side, `Sidebar ${side}`])),
        },
      });

      // ASSERT
      sides.forEach((side) => {
        expect(screen.getByText(`Sidebar ${side}`)).toHaveClass(
          "mt-layout__sidebar",
          `mt-layout__sidebar--${side}`,
        );
        expect(container.firstElementChild).toHaveClass(`mt-layout--${side}`);
      });
      expect(container.querySelectorAll(".mt-layout__sidebar")).toHaveLength(sides.length);
    },
  );

  it("renders no sidebar for a slot without content", () => {
    // ACT
    const { container } = render(MtLayout, {
      slots: { default: "Content", start: '<span v-if="false">Sidebar</span>' },
    });

    // ASSERT
    expect(container.querySelector(".mt-layout__sidebar")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveClass("mt-layout--start");
  });
});
