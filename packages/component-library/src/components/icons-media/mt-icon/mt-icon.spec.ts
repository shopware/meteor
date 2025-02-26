import { render, screen } from "@testing-library/vue";
import MtIcon from "./mt-icon.vue";

describe("mt-icon", () => {
  it("shows a regular icon", () => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "regular-3d",
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__regular-3d")).toBeVisible();
  });
});
