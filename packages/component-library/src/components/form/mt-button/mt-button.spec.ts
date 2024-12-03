import { render, screen } from "@testing-library/vue";
import MtButton from "./mt-button.vue";
import { vi } from "vitest";
import { userEvent } from "@storybook/test";

describe("mt-button", () => {
  it("performs an action when clicking on a button", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtButton, {
      props: {
        // @ts-expect-error -- Event handler is not typed because they are inherited
        onClick: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it.each(["{Enter}", " "])('performs an action when pressing "%s" on a button', async (key) => {
    // ARRANGE
    const handler = vi.fn();

    render(MtButton, {
      props: {
        // @ts-expect-error -- Event handler is not typed because they are inherited
        onClick: handler,
      },
    });

    await userEvent.tab();

    // ACT
    await userEvent.keyboard(key);

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not perform an action when clicking on a disabled button", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtButton, {
      props: {
        // @ts-expect-error -- Event handler is not typed because they are inherited
        onClick: handler,
        disabled: true,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it.each(["{Enter}", " "])(
    'does not perform an action when pressing "%s" on a disabled button',
    async (key) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtButton, {
        props: {
          // @ts-expect-error -- Event handler is not typed because they are inherited
          onClick: handler,
          disabled: true,
        },
      });

      await userEvent.tab();

      // ACT
      await userEvent.keyboard(key);

      // ASSERT
      expect(handler).not.toHaveBeenCalled();
    },
  );
});
