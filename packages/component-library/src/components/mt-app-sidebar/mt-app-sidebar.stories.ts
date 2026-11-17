import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtAppSidebar from "./mt-app-sidebar.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import {
  demoComponents,
  demoSections,
  shortDemoSections,
  demoStartTemplate,
  demoEndTemplate,
} from "./_mocks/demo-navigation";

export type MtAppSidebarMeta = SlottedMeta<typeof MtAppSidebar, "start" | "actions" | "end">;

const meta: MtAppSidebarMeta = {
  title: "Components/App Sidebar",
  component: MtAppSidebar,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    sections: demoSections,
    start: "",
    actions: "",
    end: "",
  },
  argTypes: {
    start: { control: { type: "text" } },
    actions: { control: { type: "text" } },
    end: { control: { type: "text" } },
  },
  render: (args) => ({
    components: demoComponents,
    setup: () => ({ args }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-app-sidebar :sections="args.sections">
    <template v-if="args.start" #start>
      <div v-html="args.start"></div>
    </template>
    <template v-else #start>
      ${demoStartTemplate}
    </template>

    <template v-if="args.actions" #actions>
      <div v-html="args.actions"></div>
    </template>

    <template v-if="args.end" #end>
      <div v-html="args.end"></div>
    </template>
    <template v-else #end>
      ${demoEndTemplate}
    </template>
  </mt-app-sidebar>
</div>`,
  }),
};

export default meta;
export type MtAppSidebarStory = StoryObj<MtAppSidebarMeta>;

export const Default: MtAppSidebarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-app-sidebar :sections="sections">
  <template #start>
    <mt-brand title="Demo shop" subtitle="Shopware" />
  </template>

  <template #end>
    <mt-user-menu name="Max Mustermann" subtitle="Administrator">
      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical" @select="logout">
          Log out
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>
  </template>
</mt-app-sidebar>`,
      },
    },
  },
};

export const ShortNavigation: MtAppSidebarStory = {
  name: "Short navigation",
  args: {
    sections: shortDemoSections,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the navigation fits, nothing scrolls. The end still sits at the bottom of the sidebar.",
      },
    },
  },
};

export const WithActions: MtAppSidebarStory = {
  name: "With actions",
  render: () => ({
    components: { ...demoComponents, MtButton, MtIcon },
    setup: () => ({ sections: demoSections }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-app-sidebar :sections="sections">
    <template #start>
      ${demoStartTemplate}
    </template>

    <template #actions>
      <mt-button variant="tertiary" size="default" square aria-label="Notifications">
        <template #iconFront>
          <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
        </template>
      </mt-button>
    </template>

    <template #end>
      ${demoEndTemplate}
    </template>
  </mt-app-sidebar>
</div>`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `actions` slot sits below the start, for example for a button that opens the notifications.",
      },
      source: {
        language: "html",
        code: `<mt-app-sidebar :sections="sections">
  <template #start>
    <mt-brand title="Demo shop" subtitle="Shopware" />
  </template>

  <template #actions>
    <mt-button variant="tertiary" size="default" square aria-label="Notifications">
      <template #iconFront>
        <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
      </template>
    </mt-button>
  </template>
</mt-app-sidebar>`,
      },
    },
  },
};
