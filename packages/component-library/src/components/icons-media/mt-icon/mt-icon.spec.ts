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

  it("shows a solid icon", () => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "solid-3d",
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__solid-3d")).toBeVisible();
  });

  it("shows an icon without specifiying the icon mode", () => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "3d",
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__regular-3d")).toBeVisible();
  });

  it.each(["regular", "solid"] as const)("shows the icon when specifing the mode: %s", (mode) => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "3d",
        mode,
      },
    });

    // ASSERT
    expect(screen.getByTestId(`mt-icon__${mode}-3d`)).toBeVisible();
  });
});
