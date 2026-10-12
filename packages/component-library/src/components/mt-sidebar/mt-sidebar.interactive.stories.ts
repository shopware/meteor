import { within, expect, waitFor, userEvent } from "@storybook/test";

import meta, { type MtSidebarMeta, type MtSidebarStory } from "./mt-sidebar.stories";
import {
  demoComponents,
  demoLinkComponent,
  demoSections,
  shortDemoSections,
  demoNavigationTemplate,
  demoHeaderTemplate,
  demoFooterTemplate,
} from "./_mocks/demo-navigation";

export default {
  ...meta,
  title: "Components/Sidebar/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarMeta;

function renderSidebar(options: { sections?: typeof demoSections } = {}) {
  return () => ({
    components: demoComponents,
    setup: () => ({
      sections: options.sections ?? demoSections,
      linkComponent: demoLinkComponent,
    }),
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

/**
 * Scrolls the body so that the link is cut off a little at the given edge,
 * like the next link when moving through the navigation with the arrow keys.
 */
function scrollLinkPartlyOutOfView(body: HTMLElement, link: HTMLElement, edge: "top" | "bottom") {
  const bodyRect = body.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const hiddenPart = linkRect.height / 4;

  body.scrollTop +=
    edge === "top"
      ? linkRect.top - bodyRect.top + hiddenPart
      : linkRect.bottom - bodyRect.bottom - hiddenPart;
}

export const VisualTestDefault: MtSidebarStory = {
  name: "Render sidebar with header, navigation and footer",
};

export const VisualTestShortNavigation: MtSidebarStory = {
  name: "Render sidebar with short navigation",
  render: renderSidebar({ sections: shortDemoSections }),
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

export const TestKeepsFocusedLinkClearOfBottomShadow: MtSidebarStory = {
  name: "Keeps a focused link clear of the bottom shadow",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    const link = canvas.getByRole("link", { name: "Payments" });
    scrollLinkPartlyOutOfView(body, link, "bottom");
    link.focus();

    await waitFor(() => {
      const shadow = canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom");
      if (!shadow) throw new Error("Bottom shadow not found");

      expect(link.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        shadow.getBoundingClientRect().top,
      );
    });
  },
};

export const TestKeepsFocusedLinkClearOfTopShadow: MtSidebarStory = {
  name: "Keeps a focused link clear of the top shadow",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    const link = canvas.getByRole("link", { name: "Customers" });
    scrollLinkPartlyOutOfView(body, link, "top");
    link.focus();

    await waitFor(() => {
      const shadow = canvasElement.querySelector(".mt-sidebar__scroll-shadow--top");
      if (!shadow) throw new Error("Top shadow not found");

      expect(link.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        shadow.getBoundingClientRect().bottom,
      );
    });
  },
};

export const TestKeepsWidthNextToWideContent: MtSidebarStory = {
  name: "Keeps its width next to wide content",
  render: () => ({
    components: demoComponents,
    setup: () => ({ sections: demoSections, linkComponent: demoLinkComponent }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    ${demoNavigationTemplate}
  </mt-sidebar>

  <div style="min-width: 2000px;">Wide content</div>
</div>`,
  }),
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector<HTMLElement>(".mt-sidebar");
    if (!sidebar) throw new Error("Sidebar not found");

    expect(sidebar.getBoundingClientRect().width).toBe(300);
  },
};

export const TestRechecksShadowsWhenNavigationGrows: MtSidebarStory = {
  name: "Rechecks the shadows when the navigation grows",
  render: () => ({
    components: demoComponents,
    setup: () => ({ sections: shortDemoSections, linkComponent: demoLinkComponent }),
    template: `
<div style="height: 260px; display: flex;">
  <mt-sidebar>
    ${demoNavigationTemplate}
  </mt-sidebar>
</div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom")).toBeNull();

    // Opening a group makes the navigation taller without scrolling it
    await userEvent.click(canvas.getByRole("button", { name: "Catalogues" }));

    await waitFor(() => {
      expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow--bottom")).not.toBeNull();
    });
  },
};

export const TestShowsNoShadowsWhenNavigationFits: MtSidebarStory = {
  name: "Shows no shadows when the navigation fits",
  render: renderSidebar({ sections: shortDemoSections }),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-sidebar__body");
    if (!body) throw new Error("Sidebar body not found");

    expect(body.scrollHeight).toBeLessThanOrEqual(body.clientHeight);
    expect(canvasElement.querySelector(".mt-sidebar__scroll-shadow")).toBeNull();
  },
};
