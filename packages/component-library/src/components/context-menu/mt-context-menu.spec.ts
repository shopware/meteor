import { userEvent } from "@storybook/test";
import { render, screen } from "@testing-library/vue";
import MtContextButton from "./mt-context-button/mt-context-button.vue";
import { defineComponent } from "vue";
import MtContextMenuItem from "./mt-context-menu-item/mt-context-menu-item.vue";

describe("mt-context-menu", async () => {
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

  it("closes the context menu when clicking on the button a second time", async () => {
    // ARRANGE
    render(MtContextButton);

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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

  it("emits a click event when clicking on a context menu item", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(
      defineComponent({
        components: { MtContextButton, MtContextMenuItem },
        setup: () => ({ handler }),
        template: `
<mt-context-button>
    <mt-context-menu-item @click="handler">Item 1</mt-context-menu-item>
</mt-context-button>
 `,
      }),
    );

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByRole("menuitem"));

    // ASSERT
    expect(handler).toHaveBeenCalledWith();
  });

  it("closes the context menu when clicking on a context menu item", async () => {
    // ARRANGE
    render(
      defineComponent({
        components: { MtContextButton, MtContextMenuItem },
        template: `
<mt-context-button>
  <template #default="{ toggleFloatingUi }">
    <mt-context-menu-item @click="toggleFloatingUi">Item 1</mt-context-menu-item>
  </template>
</mt-context-button>
 `,
      }),
    );

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByRole("menuitem"));

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not emit a click event when clicking on a disabled context menu item", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(
      defineComponent({
        components: { MtContextButton, MtContextMenuItem },
        setup: () => ({ handler }),
        template: `
<mt-context-button>
    <mt-context-menu-item disabled @click="handler">Item 1</mt-context-menu-item>
</mt-context-button>
 `,
      }),
    );

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByRole("menuitem"));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });
});
