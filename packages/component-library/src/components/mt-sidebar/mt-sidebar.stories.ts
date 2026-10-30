import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtSidebar from "./mt-sidebar.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import {
  demoComponents,
  demoLinkComponent,
  demoSections,
  shortDemoSections,
  demoNavigationTemplate,
  demoHeaderTemplate,
  demoFooterTemplate,
} from "./_mocks/demo-navigation";

export type MtSidebarMeta = SlottedMeta<
  typeof MtSidebar,
  "header" | "actions" | "default" | "footer"
>;

const meta: MtSidebarMeta = {
  title: "Components/Sidebar",
  component: MtSidebar,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    header: "",
    actions: "",
    default: "",
    footer: "",
  },
  argTypes: {
    header: { control: { type: "text" } },
    actions: { control: { type: "text" } },
    default: { control: { type: "text" } },
    footer: { control: { type: "text" } },
  },
  render: (args) => ({
    components: demoComponents,
    setup: () => ({ args, sections: demoSections, linkComponent: demoLinkComponent }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar v-bind="args">
    <template v-if="args.header" #header>
      <div v-html="args.header"></div>
    </template>
    <template v-else #header>
      ${demoHeaderTemplate}
    </template>

    <template v-if="args.actions" #actions>
      <div v-html="args.actions"></div>
    </template>

    <template v-if="args.default" #default>
      <div v-html="args.default"></div>
    </template>
    <template v-else #default>
      ${demoNavigationTemplate}
    </template>

    <template v-if="args.footer" #footer>
      <div v-html="args.footer"></div>
    </template>
    <template v-else #footer>
      ${demoFooterTemplate}
    </template>
  </mt-sidebar>
</div>`,
  }),
};

export default meta;
export type MtSidebarStory = StoryObj<MtSidebarMeta>;

export const Default: MtSidebarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar>
  <template #header>
    <mt-brand title="Demo shop" subtitle="Shopware" />
  </template>

  <mt-nav :sections="sections" />

  <template #footer>
    <mt-user-menu name="Max Mustermann" subtitle="Administrator">
      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical" @select="logout">
          Log out
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>
  </template>
</mt-sidebar>`,
      },
    },
  },
};

export const ShortNavigation: MtSidebarStory = {
  name: "Short navigation",
  render: () => ({
    components: demoComponents,
    setup: () => ({ sections: shortDemoSections, linkComponent: demoLinkComponent }),
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
  }),
  parameters: {
    docs: {
      description: {
        story:
          "When the navigation fits, nothing scrolls. The footer still sits at the bottom of the sidebar.",
      },
    },
  },
};

export const WithActions: MtSidebarStory = {
  name: "With actions",
  render: () => ({
    components: { ...demoComponents, MtButton, MtIcon },
    setup: () => ({ sections: demoSections, linkComponent: demoLinkComponent }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    <template #header>
      ${demoHeaderTemplate}
    </template>

    <template #actions>
      <mt-button variant="tertiary" size="default" square aria-label="Notifications">
        <template #iconFront>
          <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
        </template>
      </mt-button>
    </template>

    ${demoNavigationTemplate}

    <template #footer>
      ${demoFooterTemplate}
    </template>
  </mt-sidebar>
</div>`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `actions` slot sits next to the header, for example for a button that opens the notifications.",
      },
      source: {
        language: "html",
        code: `<mt-sidebar>
  <template #header>
    <mt-brand title="Demo shop" subtitle="Shopware" />
  </template>

  <template #actions>
    <mt-button variant="tertiary" size="default" square aria-label="Notifications">
      <template #iconFront>
        <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
      </template>
    </mt-button>
  </template>

  <mt-nav :sections="sections" />
</mt-sidebar>`,
      },
    },
  },
};
