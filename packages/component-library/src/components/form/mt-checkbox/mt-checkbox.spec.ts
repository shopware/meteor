import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtCheckbox from "./mt-checkbox.vue";

describe("mt-checkbox", () => {
  it("shows a checkmark when checked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not show a checkmark when unchecked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
