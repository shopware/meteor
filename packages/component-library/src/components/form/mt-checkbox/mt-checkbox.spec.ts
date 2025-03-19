import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtCheckbox from "./mt-checkbox.vue";

describe("mt-checkbox", () => {
  it("shows as tooltip when focusing the inheritance switch", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        label: "Inherited",
        inheritedValue: false,
        isInherited: true,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeVisible();
  });
});
