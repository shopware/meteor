import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import MtContextButton from "./mt-context-button/mt-context-button.vue";

describe("mt-context-menu", () => {
  it("is possible to focus the button that opens the context menu", async () => {
    // ARRANGE
    render(MtContextButton);

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("is possible to open the context menu by clicking on the button", async () => {
    // ARRANGE
    render(MtContextButton);

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it.each([" ", "{Enter}"])(
    'is possible to open the context menu by pressing "%s"',
    async (key) => {
      // ARRANGE
      render(MtContextButton);

      // ARRANGE
      await userEvent.tab();
      await userEvent.keyboard(key);

      // ACT
      expect(screen.getByRole("dialog")).toBeVisible();
    },
  );

  it("is possible to set a custom element for the button", async () => {
    // ARRANGE
    render(MtContextButton, {
      slots: { button: "<button>Open context menu</button>" },
    });

    // ASSERT
    expect(screen.getByRole("button")).toBeVisible();
    expect(screen.getByRole("button")).toHaveTextContent("Open context menu");
  });

  it("is possible to set a custom text for the button", async () => {
    // ARRANGE
    render(MtContextButton, {
      slots: { "button-text": "Open context menu" },
    });

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("Open context menu");
  });

  it("shows the ellipsis icon by default", async () => {
    // ARRANGE
    render(MtContextButton);

    // ASSERT
    expect(screen.getByTestId("mt-icon__solid-ellipsis-h-s")).toBeVisible();
  });

  it("shows an icon when specified", async () => {
    // ARRANGE
    render(MtContextButton, {
      props: {
        icon: "solid-times-s",
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__solid-times-s")).toBeVisible();
  });
});
