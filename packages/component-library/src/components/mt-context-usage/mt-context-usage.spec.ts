import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtContextUsage from "./mt-context-usage.vue";

describe("mt-context-usage", () => {
  it("is a button described by the share of the context window that is used", () => {
    render(MtContextUsage, { props: { used: 84_000, total: 200_000 } });

    expect(screen.getByRole("button", { name: "Context usage" })).toHaveAccessibleDescription(
      "84K of 200K tokens used (42%)",
    );
  });

  it.each([
    [150_000, "mt-progress-ring--default"],
    [160_000, "mt-progress-ring--attention"],
    [190_000, "mt-progress-ring--critical"],
  ])("colors %i of 200K tokens with %s", (used, variantClass) => {
    const { container } = render(MtContextUsage, { props: { used, total: 200_000 } });

    expect(container.querySelector(".mt-progress-ring")).toHaveClass(variantClass);
  });

  it("clamps the usage to the context window", () => {
    render(MtContextUsage, { props: { used: 250_000, total: 200_000 } });

    expect(screen.getByRole("button")).toHaveAccessibleDescription(
      "250K of 200K tokens used (100%)",
    );
  });

  it("passes listeners to the button", () => {
    let clicks = 0;
    render(MtContextUsage, {
      props: { used: 1_000, total: 200_000 },
      attrs: { onClick: () => clicks++ },
    });

    screen.getByRole("button").click();

    expect(clicks).toBe(1);
  });
});
