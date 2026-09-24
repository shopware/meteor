import { within, expect, userEvent, waitFor } from "@storybook/test";
import { defineStory } from "@/_internal/story-helper";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";

import meta, {
  Composable,
  ContentOnly,
  Dark,
  Default,
  DynamicRegions,
  Embedded,
  Layering,
  LongContent,
  Mobile,
  MobileHeaderless,
  MobileLongContent,
  type MtAppMeta,
  type MtAppStory,
} from "./mt-app.stories";

export default {
  ...meta,
  title: "Components/App/Interaction tests",
  tags: ["!autodocs"],
  beforeEach: () => useSnackbar().clearSnackbars(),
} as MtAppMeta;

const startTrigger = { name: "Open Primary sidebar" };
const endTrigger = { name: "Open Secondary sidebar" };

/** Cards inside the content render `<header>` elements too, so the shell header is queried directly. */
function shellHeader(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>(".mt-app__header");
}

/**
 * A closed drawer is hidden (visibility: hidden + inert), so it has no accessible name
 * and cannot be found through a role query.
 */
function closedDrawer(canvasElement: HTMLElement, name: string) {
  return canvasElement.querySelector<HTMLElement>(`[role="dialog"][aria-label="${name}"]`);
}

function topmostElementAt(element: Element) {
  const rect = element.getBoundingClientRect();

  return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

async function openDrawer(
  canvas: ReturnType<typeof within>,
  trigger: { name: string },
  drawerName: string,
) {
  await userEvent.click(canvas.getByRole("button", trigger));
  await waitFor(() =>
    expect(canvas.getByRole("button", trigger)).toHaveAttribute("aria-expanded", "true"),
  );

  const drawer = canvas.getByRole("dialog", { name: drawerName });
  await waitFor(() => expect(drawer).toBeVisible());
  await Promise.all(drawer.getAnimations().map((animation) => animation.finished));

  return drawer;
}

export const VisualTestDesktop: MtAppStory = {
  ...Default,
  name: "Render the desktop layout",
};

export const VisualTestContentOnly: MtAppStory = {
  ...ContentOnly,
  name: "Render the shell with content only",
};

export const VisualTestDark: MtAppStory = {
  ...Dark,
  name: "Render the dark theme",
};

export const VisualTestEmbedded: MtAppStory = {
  ...Embedded,
  name: "Render an embedded shell with a fixed height",
};

export const VisualTestHeaderPopoverOpen = defineStory<MtAppMeta>(
  {
    name: "Render a header popover above the content",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);

      await userEvent.click(canvas.getByRole("button", { name: "Jane Doe" }));
      await screen.findByText("Sign out");
    },
  },
  { from: Default },
);

export const VisualTestMobileClosed: MtAppStory = {
  ...Mobile,
  name: "Render the mobile layout with closed drawers",
};

export const VisualTestMobileStartDrawerOpen: MtAppStory = {
  ...Mobile,
  name: "Render the open navigation drawer",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", startTrigger));
    await waitFor(() =>
      expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-expanded", "true"),
    );
  },
};

export const VisualTestMobileEndDrawerOpen: MtAppStory = {
  ...Mobile,
  name: "Render the open details drawer",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", endTrigger));
    await waitFor(() =>
      expect(canvas.getByRole("button", endTrigger)).toHaveAttribute("aria-expanded", "true"),
    );
  },
};

export const VisualTestMobileHeaderless: MtAppStory = {
  ...MobileHeaderless,
  name: "Render the shell-owned header on mobile",
};

export const TestDesktopLayout: MtAppStory = {
  ...Default,
  name: "Shows inline sidebars and no triggers on desktop",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(shellHeader(canvasElement)).toBeVisible();
    expect(canvas.getByRole("main")).toBeVisible();
    expect(canvas.getByRole("complementary", { name: "Primary sidebar" })).toBeVisible();
    expect(canvas.getByRole("complementary", { name: "Secondary sidebar" })).toBeVisible();
    expect(canvas.queryByRole("button", startTrigger)).not.toBeInTheDocument();
    expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const TestContentSpacing: MtAppStory = {
  ...Default,
  name: "Keeps 8px around and between the regions below the header",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const header = shellHeader(canvasElement)!.getBoundingClientRect();
    const main = canvas.getByRole("main").getBoundingClientRect();
    const start = canvas
      .getByRole("complementary", { name: "Primary sidebar" })
      .getBoundingClientRect();
    const end = canvas
      .getByRole("complementary", { name: "Secondary sidebar" })
      .getBoundingClientRect();
    const shell = canvasElement.querySelector(".mt-app")!.getBoundingClientRect();

    expect(main.top - header.bottom).toBeCloseTo(0, 0);
    expect(main.left - start.right).toBeCloseTo(8, 0);
    expect(end.left - main.right).toBeCloseTo(8, 0);
    expect(shell.bottom - main.bottom).toBeCloseTo(8, 0);
    expect(start.left - shell.left).toBeCloseTo(8, 0);
    expect(shell.right - end.right).toBeCloseTo(8, 0);
    expect(start.top - header.bottom).toBeCloseTo(0, 0);
    expect(header.top).toBeCloseTo(shell.top, 0);
  },
};

export const TestContentOnlySpacing: MtAppStory = {
  ...ContentOnly,
  name: "Keeps the content panel 8px away from the shell edges without other regions",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const main = canvas.getByRole("main").getBoundingClientRect();
    const shell = canvasElement.querySelector(".mt-app")!.getBoundingClientRect();

    expect(shellHeader(canvasElement)).toBeNull();
    expect(canvas.queryByRole("complementary")).not.toBeInTheDocument();
    expect(main.top - shell.top).toBeCloseTo(8, 0);
    expect(main.left - shell.left).toBeCloseTo(8, 0);
    expect(shell.right - main.right).toBeCloseTo(8, 0);
    expect(shell.bottom - main.bottom).toBeCloseTo(8, 0);
  },
};

export const TestMobileTriggersControlDrawers: MtAppStory = {
  ...Mobile,
  name: "Opens a drawer from its trigger and closes it with the close button",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-expanded", "false");
    expect(closedDrawer(canvasElement, "Primary sidebar")).not.toBeVisible();
    expect(closedDrawer(canvasElement, "Primary sidebar")).toHaveAttribute("inert");

    const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
    await waitFor(() => expect(drawer).toHaveFocus());
    expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-expanded", "true");
    expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-controls", drawer.id);
    expect(canvas.getByRole("main")).toHaveAttribute("inert");

    await userEvent.click(canvas.getByRole("button", { name: "Close Primary sidebar" }));

    await waitFor(() => expect(drawer).not.toBeVisible());
    expect(canvas.getByRole("main")).not.toHaveAttribute("inert");
    await waitFor(() => expect(canvas.getByRole("button", startTrigger)).toHaveFocus());
  },
};

export const TestEscapeClosesDrawer: MtAppStory = {
  ...Mobile,
  name: "Closes the drawer on Escape",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const drawer = await openDrawer(canvas, endTrigger, "Secondary sidebar");
    await waitFor(() => expect(drawer).toHaveFocus());
    expect(args["onDrawer-change"]).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(drawer).not.toBeVisible());
    await waitFor(() => expect(canvas.getByRole("button", endTrigger)).toHaveFocus());
  },
};

export const TestBackdropClickClosesDrawer: MtAppStory = {
  ...Mobile,
  name: "Closes the drawer when the backdrop is clicked",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
    expect(args["onDrawer-change"]).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByTestId("mt-app-backdrop"));

    await waitFor(() => expect(drawer).not.toBeVisible());
    expect(args["onDrawer-change"]).toHaveBeenNthCalledWith(1, "start");
    expect(args["onDrawer-change"]).toHaveBeenNthCalledWith(2, null);
  },
};

export const TestOnlyOneDrawerOpen: MtAppStory = {
  ...Mobile,
  name: "Opening the second drawer closes the first one",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startDrawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
    const endDrawer = await openDrawer(canvas, endTrigger, "Secondary sidebar");

    await waitFor(() => expect(startDrawer).not.toBeVisible());
    expect(endDrawer).toBeVisible();
    expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-expanded", "false");
    expect(canvas.getByRole("button", endTrigger)).toHaveAttribute("aria-expanded", "true");
  },
};

export const TestTabStaysInsideDrawer: MtAppStory = {
  ...Mobile,
  name: "Wraps the keyboard focus inside the open drawer",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
    await waitFor(() => expect(drawer).toHaveFocus());

    await userEvent.tab({ shift: true });

    expect(within(drawer).getByRole("button", { name: "Send feedback" })).toHaveFocus();

    await userEvent.tab();

    expect(within(drawer).getByRole("button", { name: "Close Primary sidebar" })).toHaveFocus();
  },
};

export const TestScrollPositionPreserved: MtAppStory = {
  ...MobileLongContent,
  name: "Keeps the content scroll position while a drawer is open",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole("main");
    main.scrollTop = 300;
    expect(main.scrollTop).toBe(300);

    const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
    expect(main.scrollTop).toBe(300);

    await userEvent.click(canvas.getByTestId("mt-app-backdrop"));
    await waitFor(() => expect(drawer).not.toBeVisible());
    expect(main.scrollTop).toBe(300);
    expect(window.scrollY).toBe(0);
  },
};

export const TestHeaderlessMobileRendersShellHeader: MtAppStory = {
  ...MobileHeaderless,
  name: "Renders a shell-owned header for the triggers when there is no header content",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(shellHeader(canvasElement)).toBeVisible();
    expect(shellHeader(canvasElement)).not.toHaveTextContent("Meteor Shop");
    expect(canvas.getByRole("button", startTrigger)).toBeVisible();
    expect(canvas.queryByRole("button", endTrigger)).not.toBeInTheDocument();
  },
};

export const TestActionMenuInsideDrawerKeepsItOpen = defineStory<MtAppMeta>(
  {
    name: "Keeps the drawer open while a menu inside it is used",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);

      const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");

      await userEvent.click(within(drawer).getByRole("button", { name: "More actions" }));
      const menu = await screen.findByRole("menu");
      const item = within(menu).getByRole("menuitem", { name: "Copy link" });
      const rect = item.getBoundingClientRect();
      expect(
        document
          .elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
          ?.closest("[role=menu]"),
      ).toBe(menu);

      await userEvent.click(item);

      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(drawer).toBeVisible();
      expect(canvas.getByRole("button", startTrigger)).toHaveAttribute("aria-expanded", "true");
    },
  },
  { from: Mobile },
);

export const TestOverlayLayering = defineStory<MtAppMeta>(
  {
    name: "Layers overlays above the drawer and closes one layer per Escape",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);
      const drawer = await openDrawer(canvas, startTrigger, "Primary sidebar");
      const filters = within(drawer).getByRole("button", { name: "Filters" });

      await userEvent.click(filters);
      const popoverItem = await screen.findByText("Shipped orders");
      await waitFor(() => expect(popoverItem.contains(topmostElementAt(popoverItem))).toBe(true));
      await userEvent.click(filters);
      await waitFor(() => expect(screen.queryByText("Shipped orders")).not.toBeInTheDocument());

      await userEvent.click(within(drawer).getByRole("button", { name: "Edit order" }));
      const modal = await screen.findByRole("dialog", { name: "Edit order" });
      await waitFor(() => expect(modal).toHaveFocus());
      expect(modal.contains(topmostElementAt(modal))).toBe(true);
      expect(drawer.closest("[inert]")).not.toBeNull();

      await userEvent.click(within(modal).getByRole("textbox"));
      const option = await screen.findByTestId("mt-select-option--express");
      await waitFor(() => expect(option.contains(topmostElementAt(option))).toBe(true));

      await userEvent.click(within(modal).getByRole("button", { name: "Save" }));
      const snackbar = (await screen.findByText("Order saved")).closest<HTMLElement>(
        ".mt-snackbar-notification",
      )!;
      await waitFor(() => expect(snackbar.contains(topmostElementAt(snackbar))).toBe(true));
      expect(snackbar.closest("[inert]")).toBeNull();

      await userEvent.click(within(modal).getByRole("textbox"));
      await screen.findByTestId("mt-select-option--express");
      await userEvent.keyboard("{Escape}");

      await waitFor(() =>
        expect(screen.queryByTestId("mt-select-option--express")).not.toBeInTheDocument(),
      );
      expect(modal).toBeInTheDocument();

      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(modal).not.toBeInTheDocument());
      expect(drawer).toBeVisible();
      await waitFor(() =>
        expect(within(drawer).getByRole("button", { name: "Edit order" })).toHaveFocus(),
      );

      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(drawer).not.toBeVisible());
    },
  },
  { from: Layering },
);

export const TestDocumentDoesNotScroll: MtAppStory = {
  ...LongContent,
  name: "Scrolls the content panel while the document stays in place",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole("main");
    const root = document.documentElement;

    expect(getComputedStyle(root).overflowY).toBe("hidden");
    expect(root.scrollHeight).toBe(root.clientHeight);
    expect(main.scrollHeight).toBeGreaterThan(main.clientHeight);
  },
};

export const TestSameElementAcrossLayouts: MtAppStory = {
  ...DynamicRegions,
  name: "Uses the same sidebar element as inline region and as drawer",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inlineSidebar = canvas.getByRole("complementary", { name: "Primary sidebar" });

    await userEvent.click(canvas.getByRole("button", { name: "Toggle mobile layout" }));

    await waitFor(() => expect(closedDrawer(canvasElement, "Primary sidebar")).toBe(inlineSidebar));
    expect(closedDrawer(canvasElement, "Primary sidebar")).toHaveAttribute("inert");

    await userEvent.click(canvas.getByRole("button", { name: "Toggle mobile layout" }));

    expect(await canvas.findByRole("complementary", { name: "Primary sidebar" })).toBe(
      inlineSidebar,
    );
  },
};

export const TestRemovingSlotRemovesTrigger: MtAppStory = {
  ...DynamicRegions,
  name: "Removes the trigger and drawer together with the sidebar content",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Toggle mobile layout" }));
    expect(await canvas.findByRole("button", endTrigger)).toBeVisible();
    expect(canvas.getByRole("button", startTrigger)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Toggle end sidebar" }));

    await waitFor(() => expect(canvas.queryByRole("button", endTrigger)).not.toBeInTheDocument());
    expect(canvas.queryByRole("dialog", { name: "Secondary sidebar" })).not.toBeInTheDocument();
    expect(canvas.getByRole("button", startTrigger)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Toggle header" }));

    await waitFor(() => expect(shellHeader(canvasElement)).not.toHaveTextContent("Meteor Shop"));
    expect(canvas.getByRole("button", startTrigger)).toBeVisible();
  },
};

export const TestShellStateAndThemeEvents: MtAppStory = {
  ...Composable,
  name: "Exposes the shell state and reports theme changes",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByTestId("shell-status")).toHaveTextContent(
      "Layout: desktop · Drawer: none · Theme: light (light)",
    );

    await userEvent.click(canvas.getByRole("button", { name: "Use dark theme" }));

    expect(args["onUpdate:theme"]).toHaveBeenCalledWith("dark");
  },
};

export const TestSnackbarHostRendersOnce = defineStory<MtAppMeta>(
  {
    name: "Renders every snackbar exactly once",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);

      await userEvent.click(canvas.getByRole("button", { name: "Show success" }));

      expect(await screen.findAllByText("Order saved")).toHaveLength(1);
    },
  },
  { from: Default },
);
