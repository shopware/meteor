import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw } from "vue";
import MtApp from "./mt-app.vue";
import MtNav, { type NavSection } from "../mt-nav/mt-nav.vue";
import MtPage from "../mt-page/mt-page.vue";
import MtText from "../mt-text/mt-text.vue";
import { StoryLink } from "../mt-nav/mt-nav.story-helper";
import { useTheme } from "@/composables/useTheme";

export type MtAppMeta = Meta<typeof MtApp>;

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: { name: "dashboard" } },
      { label: "Products", icon: "regular-products", to: { name: "products" }, active: true },
      { label: "Orders", icon: "regular-shopping-bag", to: { name: "orders" } },
    ],
  },
];

const meta: MtAppMeta = {
  title: "Components/App",
  component: MtApp,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
      // The shell locks the scrolling of its document, so the docs page renders it in a frame.
      story: {
        inline: false,
        iframeHeight: 480,
      },
    },
  },
  args: {
    breakpoint: 1280,
    loadingBar: false,
  },
  render: (args, { globals }) => ({
    components: { MtApp, MtNav, MtPage, MtText },
    setup() {
      // The shell applies the stored theme preference, so it gets the theme of the toolbar.
      useTheme().setTheme(globals.theme ?? "light");

      return { args, sections, linkComponent: markRaw(StoryLink) };
    },
    template: `
      <mt-app
        :breakpoint="args.breakpoint"
        :loading-bar="args.loadingBar"
      >
        <template #navigation>
          <mt-nav style="width: 15rem;" :sections="sections" :link-component="linkComponent" />
        </template>

        <template #content>
          <mt-page :breadcrumb="[{ label: 'Products', icon: 'products' }]">

            <mt-text size="xs">The content of the current page.</mt-text>
          </mt-page>
        </template>

        <template #sidebar>
          <div style="width: 20rem; padding: var(--scale-size-16);">
            <mt-text size="xs">A panel next to the content.</mt-text>
          </div>
        </template>
      </mt-app>`,
  }),
};

export default meta;
export type MtAppStory = StoryObj<MtAppMeta>;

export const Default: MtAppStory = {};
