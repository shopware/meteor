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

  it("merges the style prop with the internal styles", () => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "3d",
        size: "10rem",
        style: {
          color: "blue",
        },
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__regular-3d")).toHaveStyle("color: rgb(0, 0, 255)");

    expect(screen.getByTestId("mt-icon__regular-3d")).toHaveStyle("width: 10rem");
    expect(screen.getByTestId("mt-icon__regular-3d")).toHaveStyle("height: 10rem");
  });

  it("sizes itself according to the style prop", () => {
    // ARRANGE
    render(MtIcon, {
      props: {
        name: "3d",
        style: {
          width: "2rem",
          height: "2rem",
        },
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__regular-3d")).toHaveStyle("height: 2rem");
    expect(screen.getByTestId("mt-icon__regular-3d")).toHaveStyle("width: 2rem");
  });
});
