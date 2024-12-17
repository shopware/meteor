import { userEvent } from "@storybook/test";
import { render, screen } from "@testing-library/vue";
import MtSelect from "./mt-select.vue";

describe("mt-select", () => {
  it("opens the option list when clicking on the field", async () => {
    // ARRANGE
    render(MtSelect);

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(screen.getByRole("listbox")).toBeVisible();
  });
});
