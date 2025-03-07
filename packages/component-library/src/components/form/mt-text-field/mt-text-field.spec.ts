import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtTextField from "./mt-text-field.vue";
import userEvent from "@testing-library/user-event";

describe("mt-text-field", () => {
  it("displays a helptext", async () => {
    // ARRANGE
    render(MtTextField, {
      props: {
        helpText: "Helptext",
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("displays a helptext with html content", async () => {
    // ARRANGE
    render(MtTextField, {
      slots: {
        helpText: "<p data-testid='tooltip-content'>Some text</p>",
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Some text");

    expect(screen.getByTestId("tooltip-content")).toBeVisible();
  });
});
