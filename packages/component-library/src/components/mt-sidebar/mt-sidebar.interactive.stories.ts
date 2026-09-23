import { within, expect, waitFor } from "@storybook/test";

import meta, { type MtSidebarMeta, type MtSidebarStory } from "./mt-sidebar.stories";
import { navigationItems, demoNavigationTemplate } from "./_mocks/demo-navigation";
import MtSidebar from "./mt-sidebar.vue";
import MtText from "../mt-text/mt-text.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtAvatar from "../mt-avatar/mt-avatar.vue";
import MtButton from "../mt-button/mt-button.vue";

export default {
  ...meta,
  title: "Components/Sidebar/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarMeta;

function renderSidebar(options: { items?: typeof navigationItems; withHeader?: boolean } = {}) {
  return () => ({
    components: { MtSidebar, MtText, MtIcon, MtAvatar, MtButton },
    setup: () => ({ items: options.items ?? navigationItems }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    <template #header>
      <mt-text as="span" size="m" weight="semibold">Administration</mt-text>
    </template>

    ${demoNavigationTemplate}

    <template #footer>
      <div style="display: flex; align-items: center; gap: var(--scale-size-12);">
        <mt-avatar size="s" first-name="Max" last-name="Mustermann" />
        <mt-text as="span" size="s" style="flex: 1;">Max Mustermann</mt-text>
        <mt-button variant="secondary" size="small" square aria-label="Log out">
          <mt-icon name="regular-sign-out" size="var(--scale-size-16)" aria-hidden="true" />
        </mt-button>
      </div>
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

    expect(canvas.getByText("Administration")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Log out" })).toBeVisible();
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
