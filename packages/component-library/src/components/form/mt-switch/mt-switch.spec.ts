import MtSwitch from "./mt-switch.vue";
import { render, screen } from "@testing-library/vue";

describe("mt-switch", () => {
  it("is turned on", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is turned off", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
