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
});
