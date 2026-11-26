import type { Meta, StoryObj } from "@storybook/vue3";
import MtAppHeader from "./mt-app-header.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import { demoComponents, shortDemoSections } from "../mt-app-sidebar/_mocks/demo-navigation";

export type MtAppHeaderMeta = Meta<typeof MtAppHeader>;

const headerTemplate = `
<mt-app-header v-bind="args">
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

  <template #end="{ isMobile }">
    <mt-user-menu name="Max Mustermann" subtitle="Administrator" :compact="!isMobile">
      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical">Log out</mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>
  </template>
</mt-app-header>`;

const meta: MtAppHeaderMeta = {
  title: "Components/App Header",
  component: MtAppHeader,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
      source: {
        language: "html",
        code: headerTemplate.trim().replace('v-bind="args"', ':sections="sections"'),
      },
    },
  },
  args: {
    sections: shortDemoSections,
  },
  render: (args) => ({
    components: { ...demoComponents, MtAppHeader, MtButton, MtIcon },
    setup: () => ({ args }),
    template: headerTemplate,
  }),
};

export default meta;
export type MtAppHeaderStory = StoryObj<MtAppHeaderMeta>;

export const Default: MtAppHeaderStory = {};

export const Mobile: MtAppHeaderStory = {
  decorators: [() => ({ template: '<div style="width: 600px;"><story /></div>' })],
  parameters: {
    docs: {
      description: {
        story:
          "In a header narrower than `breakpoint`, a button opens the start, the navigation and the end in a drawer. The actions stay in the header.",
      },
    },
  },
};
