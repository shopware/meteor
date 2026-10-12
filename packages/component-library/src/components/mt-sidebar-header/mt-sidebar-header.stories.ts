import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import MtSidebarHeader from "./mt-sidebar-header.vue";

export type MtSidebarHeaderMeta = Meta<typeof MtSidebarHeader>;

const meta: MtSidebarHeaderMeta = {
  title: "Components/Sidebar/Header",
  component: MtSidebarHeader,
  args: {
    title: "Demo shop",
    subtitle: "Shopware",
    collapsible: true,
    onCollapse: fn(),
  },
  render: (args) => ({
    components: { MtSidebarHeader },
    setup: () => ({ args }),
    // Mimics the header area of mt-sidebar
    template: `
<div style="width: 300px; padding: var(--scale-size-24) var(--scale-size-12) var(--scale-size-12) var(--scale-size-22); background: var(--color-elevation-surface-sunken);">
  <mt-sidebar-header v-bind="args" />
</div>`,
  }),
};

export default meta;
export type MtSidebarHeaderStory = StoryObj<MtSidebarHeaderMeta>;

export const Default: MtSidebarHeaderStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar>
  <template #header>
    <mt-sidebar-header title="Demo shop" subtitle="Shopware" @collapse="onCollapse" />
  </template>

  <mt-nav :sections="sections" />
</mt-sidebar>`,
      },
    },
  },
};

export const WithoutSubtitle: MtSidebarHeaderStory = {
  name: "Without subtitle",
  args: {
    subtitle: undefined,
  },
};

export const LongTitle: MtSidebarHeaderStory = {
  name: "Long title",
  args: {
    title: "The demo shop with a very long name that does not fit",
  },
  parameters: {
    docs: {
      description: {
        story: "A title that does not fit is cut off with an ellipsis and shown in full on hover.",
      },
    },
  },
};

export const NotCollapsible: MtSidebarHeaderStory = {
  name: "Not collapsible",
  args: {
    collapsible: false,
  },
};

export const CustomLogo: MtSidebarHeaderStory = {
  name: "Custom logo",
  render: (args) => ({
    components: { MtSidebarHeader },
    setup: () => ({ args }),
    template: `
<div style="width: 300px; padding: var(--scale-size-24) var(--scale-size-12) var(--scale-size-12) var(--scale-size-22); background: var(--color-elevation-surface-sunken);">
  <mt-sidebar-header v-bind="args">
    <template #logo>
      <div style="display: grid; place-items: center; width: var(--scale-size-40); height: var(--scale-size-40); border-radius: var(--border-radius-m); background: var(--color-background-positive-default); color: var(--color-static-white); font-weight: 600;">
        DS
      </div>
    </template>
  </mt-sidebar-header>
</div>`,
  }),
};
