import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtTextShimmer from "./mt-text-shimmer.vue";

describe("mt-text-shimmer", () => {
  it("renders the slot content as shimmering secondary text", () => {
    render(MtTextShimmer, {
      slots: { default: "Generating response..." },
    });

    const text = screen.getByText("Generating response...");
    expect(text).toHaveClass("mt-text-shimmer");
    expect(text).toHaveStyle({ color: "var(--color-text-secondary-default)" });
  });

  it("passes the props of mt-text through", () => {
    render(MtTextShimmer, {
      attrs: { as: "span", size: "xl", weight: "semibold", color: "color-text-brand-default" },
      slots: { default: "Generating response..." },
    });

    const text = screen.getByText("Generating response...");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveClass("mt-text--size-xl", "mt-text--weight-semibold");
    expect(text).toHaveStyle({ color: "var(--color-text-brand-default)" });
  });
});
