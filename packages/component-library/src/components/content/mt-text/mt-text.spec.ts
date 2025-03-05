import { render, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtText from "./mt-text.vue";

describe("mt-text", () => {
  it("renders a paragraph", async () => {
    // ARRANGE
    render(MtText, {
      slots: {
        default: "Hello, world!",
      },
    });

    // ASSERT
    expect(screen.getByText("Hello, world!")).toBeVisible();
    expect(screen.getByText("Hello, world!").tagName).toBe("P");
  });

  it("renders as a span", () => {
    // ARRANGE
    render(MtText, {
      props: {
        as: "span",
      },
      slots: {
        default: "Hello, world!",
      },
    });

    // ASSERT
    expect(screen.getByText("Hello, world!")).toBeVisible();
    expect(screen.getByText("Hello, world!").tagName).toBe("SPAN");
  });
});
