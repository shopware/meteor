import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { expect, describe, it } from "vitest";
import MtFieldLabel from "./mt-field-label.vue";

describe("mt-field-label", () => {
  it("does not select the text when double clicking on it", async () => {
    // ARRANGE
    render(MtFieldLabel, {
      props: { id: "my-id" },
      slots: { default: "My label" },
    });

    // ACT
    await userEvent.dblClick(screen.getByText("My label"));

    // ASSERT
    expect(screen.getByText("My label")).not.toHaveSelection();
  });
});
