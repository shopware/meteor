import { within, expect, waitFor } from "@storybook/test";

import meta, { WithActions, type MtSidebarMeta, type MtSidebarStory } from "./mt-sidebar.stories";
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

export const VisualTestDefault: MtSidebarStory = {
  name: "Render sidebar with header, navigation and footer",
};

export const VisualTestShortNavigation: MtSidebarStory = {
  name: "Render sidebar with short navigation",
  render: renderSidebar({ sections: shortDemoSections }),
};

export const VisualTestWithActions: MtSidebarStory = {
  ...WithActions,
  name: "Render sidebar with actions next to the header",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", { name: "Minimize menu" })).toBeVisible();
  },
};

export const VisualTestScrolledToBottom: MtSidebarStory = {
  name: "Render sidebar scrolled to the bottom",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector<HTMLElement>(".mt-nav__body");
    if (!body) throw new Error("Navigation body not found");

    body.scrollTop = body.scrollHeight;

    await waitFor(() => {
      expect(body.scrollTop).toBeGreaterThan(0);
    });
  },
};

export const TestExposesLandmarks: MtSidebarStory = {
  name: "Is a complementary landmark that holds the navigation, named Main",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Main" });

    expect(canvas.getByRole("complementary")).toContainElement(navigation);
    expect(canvas.getAllByRole("navigation")).toHaveLength(1);
  },
};

export const TestUsesCustomAriaLabel: MtSidebarStory = {
  name: "Uses the given aria label",
  args: {
    ariaLabel: "Administration",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("complementary", { name: "Administration" })).toBeVisible();
  },
};

export const TestKeepsHeaderAndFooterVisibleWhileScrolling: MtSidebarStory = {
  name: "Keeps header and footer visible while the navigation scrolls",
  render: renderSidebar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.querySelector<HTMLElement>(".mt-nav__body");
    if (!body) throw new Error("Navigation body not found");

    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);

    body.scrollTop = body.scrollHeight;

    await waitFor(() => {
      expect(body.scrollTop).toBeGreaterThan(0);
    });

    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Max Mustermann Administrator" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Settings" })).toBeVisible();
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
