import { within, expect, userEvent, waitFor } from "@storybook/test";
import { defineStory } from "@/_internal/story-helper";
import meta, { Default, Floating, Guarded, type MtDrawerMeta } from "./mt-drawer.stories";

export default {
  ...meta,
  title: "Components/Drawer/Interaction tests",
  tags: ["!autodocs"],
} as MtDrawerMeta;

function topmostElementAt(element: Element) {
  const rect = element.getBoundingClientRect();

  return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

async function openDrawer(canvasElement: HTMLElement, trigger: string, name: string) {
  await userEvent.click(within(canvasElement).getByRole("button", { name: trigger }));

  const drawer = await within(document.body).findByRole("dialog", { name });
  await waitFor(() => expect(drawer).toHaveFocus());
  await waitFor(() => expect(drawer.className).not.toContain("mt-drawer-slide-enter"));

  return drawer;
}

export const VisualTestDefault = defineStory<MtDrawerMeta>(
  {
    name: "Render the default drawer",
    play: async ({ canvasElement }) => {
      await openDrawer(canvasElement, "Open drawer", "Order details");
    },
  },
  { from: Default },
);

export const VisualTestFloating = defineStory<MtDrawerMeta>(
  {
    name: "Render the floating drawer",
    play: async ({ canvasElement }) => {
      await openDrawer(canvasElement, "Open drawer", "Order details");
    },
  },
  { from: Floating },
);

export const TestGuardedClose = defineStory<MtDrawerMeta>(
  {
    name: "Asks before discarding changes and closes both layers on confirm",
    play: async ({ canvasElement, screen }) => {
      const drawer = await openDrawer(canvasElement, "Edit order", "Order details");

      await userEvent.type(within(drawer).getByRole("textbox", { name: "Customer" }), "Jane Doe");
      await userEvent.keyboard("{Escape}");

      const confirm = await screen.findByRole("dialog", { name: "Discard changes?" });
      await waitFor(() => expect(confirm).toHaveFocus());
      expect(drawer).toBeVisible();
      expect(drawer.closest("[inert]")).not.toBeNull();
      expect(confirm.contains(topmostElementAt(confirm))).toBe(true);

      await userEvent.click(within(confirm).getByRole("button", { name: "Discard changes" }));

      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    },
  },
  { from: Guarded },
);

export const TestSelectInsideDrawer = defineStory<MtDrawerMeta>(
  {
    name: "Keeps a select inside the drawer usable",
    play: async ({ canvasElement, screen }) => {
      const drawer = await openDrawer(canvasElement, "Edit order", "Order details");

      const select = drawer.querySelector<HTMLInputElement>(".mt-select-selection-list__input")!;

      await userEvent.click(select);
      const option = await screen.findByTestId("mt-select-option--express");
      await waitFor(() => expect(option.contains(topmostElementAt(option))).toBe(true));
      expect(option.closest("[inert]")).toBeNull();

      await userEvent.click(option);

      await waitFor(() =>
        expect(screen.queryByTestId("mt-select-option--express")).not.toBeInTheDocument(),
      );
      expect(select).toHaveValue("Express");
      expect(drawer).toBeVisible();
    },
  },
  { from: Guarded },
);
