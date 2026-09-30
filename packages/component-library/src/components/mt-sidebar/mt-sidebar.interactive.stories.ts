import { within, expect, waitFor } from "@storybook/test";

import meta, { type MtSidebarMeta, type MtSidebarStory } from "./mt-sidebar.stories";
import {
  demoComponents,
  navigationItems,
  demoNavigationTemplate,
  demoHeaderTemplate,
  demoFooterTemplate,
} from "./_mocks/demo-navigation";

export default {
  ...meta,
  title: "Components/Sidebar/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarMeta;

function renderSidebar(options: { items?: typeof navigationItems; withHeader?: boolean } = {}) {
  return () => ({
    components: demoComponents,
    setup: () => ({ items: options.items ?? navigationItems }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    <template #header>
      ${demoHeaderTemplate}
    </template>

    ${demoNavigationTemplate}

    <template #footer>
      ${demoFooterTemplate}
    </template>
  </mt-sidebar>
</div>`,
  });
}

export const VisualTestDefault: MtSidebarStory = {
  name: "Render sidebar with navigation only",
};

export const VisualTestWithHeaderAndFooter: MtSidebarStory = {
  name: "Render sidebar with header and footer",
  render: renderSidebar(),
};

export const VisualTestShortNavigation: MtSidebarStory = {
  name: "Render sidebar with short navigation",
  render: renderSidebar({ items: navigationItems.slice(0, 4) }),
};

export const VisualTestScrolledToBottom: MtSidebarStory = {
  name: "Render sidebar scrolled to the bottom",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    body.scrollTop = body.scrollHeight;

    await waitFor(() => {
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--top")).not.toBeNull();
    });
  },
};

export const TestExposesComplementaryLandmark: MtSidebarStory = {
  name: "Exposes a complementary landmark with an accessible name",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("complementary", { name: "Sidebar" })).toBeVisible();
  },
};

export const TestUsesCustomAriaLabel: MtSidebarStory = {
  name: "Uses the given aria label",
  args: {
    ariaLabel: "Main navigation",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("complementary", { name: "Main navigation" })).toBeVisible();
  },
};

export const TestKeepsHeaderAndFooterVisibleWhileScrolling: MtSidebarStory = {
  name: "Keeps header and footer visible while the navigation scrolls",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);

    body.scrollTop = body.scrollHeight;

    await waitFor(() => {
      expect(body.scrollTop).toBeGreaterThan(0);
    });

    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByRole("button", { name: "User menu: Max Mustermann" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Settings" })).toBeVisible();
  },
};

export const TestShowsBottomShadowAtTop: MtSidebarStory = {
  name: "Shows only the bottom shadow when scrolled to the top",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom")).not.toBeNull();
    });
    expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--top")).toBeNull();
  },
};

export const TestShowsBothShadowsInTheMiddle: MtSidebarStory = {
  name: "Shows both shadows while scrolled in the middle",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    body.scrollTop = Math.floor((body.scrollHeight - body.clientHeight) / 2);

    await waitFor(() => {
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--top")).not.toBeNull();
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom")).not.toBeNull();
    });
  },
};

export const TestShowsTopShadowAtBottom: MtSidebarStory = {
  name: "Shows only the top shadow when scrolled to the bottom",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    body.scrollTop = body.scrollHeight;

    await waitFor(() => {
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--top")).not.toBeNull();
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom")).toBeNull();
    });
  },
};

export const TestShowsNoShadowsWhenNavigationFits: MtSidebarStory = {
  name: "Shows no shadows when the navigation fits",
  render: renderSidebar({ items: navigationItems.slice(0, 4) }),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    expect(body.scrollHeight).toBeLessThanOrEqual(body.clientHeight);
    expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow")).toBeNull();
  },
};
