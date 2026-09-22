import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref } from "vue";
import MtNav from "../mt-nav.vue";
import MtNavSection from "../mt-nav-section.vue";
import MtNavItem from "../mt-nav-item.vue";
import type { NavNavigateEvent } from "../mt-nav.types";
import { items, shopItems, systemItems } from "./entries";
import { StoryLink } from "./story-link";
import { StoryNavItems } from "./story-nav-items";

export type MtNavMeta = Meta<typeof MtNav>;

/**
 * Renders the given template with the sample items and follows the clicked row with a fake
 * current route, so the active state changes like in an application. `sourceCode` is what the
 * docs show: the rows written out as an application would.
 */
function createStory(template: string, sourceCode: string): MtNavStory {
  return {
    render: (args) => ({
      components: { MtNav, MtNavSection, MtNavItem, StoryNavItems },
      setup() {
        const current = ref("product.index");

        function onNavigate(event: NavNavigateEvent) {
          const name = (event.to as { name?: string } | undefined)?.name;

          if (name) {
            current.value = name;
          }
        }

        return { args, current, onNavigate, items, shopItems, systemItems };
      },
      template,
    }),
    parameters: {
      docs: {
        source: {
          code: sourceCode.trim(),
        },
      },
    },
  };
}

const defaultTemplate = `
<mt-nav v-bind="args" @navigate="onNavigate">
  <mt-nav-section>
    <story-nav-items :items="items" :current="current" />
  </mt-nav-section>
</mt-nav>`;

const defaultSource = `
<mt-nav @navigate="onNavigate">
  <mt-nav-section>
    <mt-nav-item label="Dashboard" icon="regular-home" :to="{ name: 'dashboard.index' }" :active="isCurrent('dashboard.index')" />

    <mt-nav-item label="Catalogues" icon="regular-products">
      <mt-nav-item label="Products" :to="{ name: 'product.index' }" :active="isCurrent('product.index')">
        <mt-nav-item label="Reviews" :to="{ name: 'review.index' }" :active="isCurrent('review.index')" />
      </mt-nav-item>
      <mt-nav-item label="Categories" :to="{ name: 'category.index' }" :active="isCurrent('category.index')" />
    </mt-nav-item>

    <mt-nav-item label="Docs" href="https://docs.shopware.com" target="_blank" />
  </mt-nav-section>
</mt-nav>`;

const sectionsTemplate = `
<mt-nav v-bind="args" @navigate="onNavigate">
  <mt-nav-section header="Shop">
    <story-nav-items :items="shopItems" :current="current" />
  </mt-nav-section>

  <mt-nav-section header="System">
    <story-nav-items :items="systemItems" :current="current" />
  </mt-nav-section>
</mt-nav>`;

const sectionsSource = `
<mt-nav @navigate="onNavigate">
  <mt-nav-section header="Shop">
    <mt-nav-item label="Dashboard" icon="regular-home" :to="{ name: 'dashboard.index' }" :active="isCurrent('dashboard.index')" />
    <mt-nav-item label="Orders" icon="regular-shopping-bag" :to="{ name: 'order.index' }" :active="isCurrent('order.index')" />
  </mt-nav-section>

  <mt-nav-section header="System">
    <mt-nav-item label="Settings" icon="regular-cog" :to="{ name: 'settings.index' }" :active="isCurrent('settings.index')" />
  </mt-nav-section>
</mt-nav>`;

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  subcomponents: { MtNavSection, MtNavItem },
  args: {
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
  },
  argTypes: {
    linkComponent: {
      control: false,
      description:
        "Component rendering the links. Receives the `to` of a row. Defaults to `router-link`.",
    },
  },
  ...createStory(defaultTemplate, defaultSource),
};

export default meta;

export type MtNavStory = StoryObj<MtNavMeta>;

/**
 * A single `mt-nav-section` without a header holds the `mt-nav-item` rows. Rows nest by
 * slotting further rows into them; the row marked `active` opens its ancestors.
 */
export const Default: MtNavStory = {};

/**
 * Several sections, each with a `header` above its rows.
 */
export const Sections: MtNavStory = createStory(sectionsTemplate, sectionsSource);
