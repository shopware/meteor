import { userEvent } from "@storybook/test";
import { screen, render } from "@testing-library/vue";
import MtBarePopover from "./mt-bare-popover.vue";
import { flushPromises } from "@vue/test-utils";

describe("mt-bare-popover", () => {
  it("does not show the popover by default", () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>
      `,
    });

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the popover when the trigger is clicked", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>
      `,
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("hides the popover when the trigger is clicked again", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>
      `,
    });

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each(["{Enter}", " "])(
    'opens the popover when pressing "%s" on the trigger',
    async (keyCode) => {
      // ARRANGE
      render({
        components: { MtBarePopover },
        template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>
      `,
      });

      // ACT
      await userEvent.tab();
      await userEvent.keyboard(keyCode);

      // ASSERT
      expect(screen.getByRole("dialog")).toBeVisible();
    },
  );

  it("closes the popover when clicking outside of it", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>

        <div data-testid="element-outside-of-popover"></div>
      `,
    });

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByTestId("element-outside-of-popover"));

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the popover when pressing the Escape key", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <div>Content</div>
          </template>
        </mt-bare-popover>
      `,
    });

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement?.getAttribute("id")).toBe(
      screen.getByRole("button").getAttribute("id"),
    );
  });

  it("locks the focus inside the popover when it is open", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <input />
          </template>
        </mt-bare-popover>
      `,
    });

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.keyboard("{Tab}");

    // focuses the body element
    await userEvent.keyboard("{Tab}");

    // focuses the button
    // await userEvent.keyboard("{Tab}");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("stops locking the focus when the popover gets closed by clicking outside the popover", async () => {
    // ARRANGE
    render({
      components: { MtBarePopover },
      template: `
        <mt-bare-popover>
          <template #trigger="params">
            <button v-bind="params">Trigger</button>
          </template>

          <template #default>
            <input />
          </template>
        </mt-bare-popover>

        <div data-testid="element-outside-of-popover"></div>
      `,
    });

    await userEvent.click(screen.getByRole("button"));

    // ACT
    await userEvent.click(screen.getByTestId("element-outside-of-popover"));
    await userEvent.tab();

    // ASSERT
    expect(document.activeElement?.getAttribute("id")).toBe(
      screen.getByRole("button").getAttribute("id"),
    );
  });
});
