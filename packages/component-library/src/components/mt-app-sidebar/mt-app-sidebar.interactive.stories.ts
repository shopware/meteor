import { within, expect, waitFor } from "@storybook/test";

import meta, {
  ShortNavigation,
  WithActions,
  type MtAppSidebarMeta,
  type MtAppSidebarStory,
} from "./mt-app-sidebar.stories";
import { demoComponents, demoSections } from "./_mocks/demo-navigation";

export default {
  ...meta,
  title: "Components/App Sidebar/Interaction tests",
  tags: ["!autodocs"],
} as MtAppSidebarMeta;

export const VisualTestDefault: MtAppSidebarStory = {
  name: "Render sidebar with start, navigation and end",
};

export const VisualTestShortNavigation: MtAppSidebarStory = {
  ...ShortNavigation,
  name: "Render sidebar with short navigation",
};

export const VisualTestWithActions: MtAppSidebarStory = {
  ...WithActions,
  name: "Render sidebar with actions below the start",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", { name: "Notifications" })).toBeVisible();
  },
};

export const VisualTestScrolledToBottom: MtAppSidebarStory = {
  name: "Render sidebar scrolled to the bottom",
  play: async ({ canvasElement }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      ".mt-app-sidebar__body .mt-scroll-area__viewport",
    );
    if (!viewport) throw new Error("Navigation viewport not found");

    viewport.scrollTop = viewport.scrollHeight;

    await waitFor(() => {
      expect(viewport.scrollTop).toBeGreaterThan(0);
    });
  },
};

export const TestKeepsStartAndEndVisibleWhileScrolling: MtAppSidebarStory = {
  name: "Keeps start and end visible while the navigation scrolls",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvasElement.querySelector<HTMLElement>(
      ".mt-app-sidebar__body .mt-scroll-area__viewport",
    );
    if (!viewport) throw new Error("Navigation viewport not found");

    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);

    viewport.scrollTop = viewport.scrollHeight;

    await waitFor(() => {
      expect(viewport.scrollTop).toBeGreaterThan(0);
    });

    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Max Mustermann Administrator" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Settings" })).toBeVisible();
  },
};

export const TestKeepsWidthNextToWideContent: MtAppSidebarStory = {
  name: "Keeps its width next to wide content",
  render: () => ({
    components: demoComponents,
    setup: () => ({ sections: demoSections }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-app-sidebar :sections="sections" />

  <div style="min-width: 2000px;">Wide content</div>
</div>`,
  }),
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector<HTMLElement>(".mt-app-sidebar");
    if (!sidebar) throw new Error("Sidebar not found");

    expect(sidebar.getBoundingClientRect().width).toBe(300);
  },
};
