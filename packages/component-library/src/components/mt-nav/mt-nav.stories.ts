import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref } from "vue";
import MtNav from "./mt-nav.vue";
import MtNavSection from "./mt-nav-section.vue";
import MtNavItem from "./mt-nav-item.vue";
import type { NavNavigateEvent } from "./mt-nav.vue";
import { StoryLink } from "./_internal/story-link";

export type MtNavMeta = Meta<typeof MtNav>;

/**
 * Renders the template with a fake current route that follows the clicked row, so the active
 * state changes like in an application. The docs show the same template, minus the story args.
 */
function createStory(template: string): MtNavStory {
  return {
    render: (args) => ({
      components: { MtNav, MtNavSection, MtNavItem },
      setup() {
        const current = ref("product.index");

        function isCurrent(name: string) {
          return current.value === name;
        }

        function onNavigate(event: NavNavigateEvent) {
          const name = (event.to as { name?: string } | undefined)?.name;

          if (name) {
            current.value = name;
          }
        }

        return { args, isCurrent, onNavigate };
      },
      template,
    }),
    parameters: {
      docs: {
        source: {
          code: template.replace(' v-bind="args"', "").trim(),
        },
      },
    },
  };
}

const shopRows = `
    <mt-nav-item label="Dashboard" icon="regular-home" :to="{ name: 'dashboard.index' }" :active="isCurrent('dashboard.index')" />

    <mt-nav-item label="Catalogues" icon="regular-products">
      <mt-nav-item label="Products" :to="{ name: 'product.index' }" :active="isCurrent('product.index')">
        <mt-nav-item label="Reviews" :to="{ name: 'review.index' }" :active="isCurrent('review.index')" />
      </mt-nav-item>
      <mt-nav-item label="Categories" :to="{ name: 'category.index' }" :active="isCurrent('category.index')" />
      <mt-nav-item label="Manufacturers" :to="{ name: 'manufacturer.index' }" :active="isCurrent('manufacturer.index')" />
    </mt-nav-item>

    <mt-nav-item label="Orders" icon="regular-shopping-bag" :to="{ name: 'order.index' }" :active="isCurrent('order.index')" />
    <mt-nav-item label="Customers" icon="regular-users" :to="{ name: 'customer.index' }" :active="isCurrent('customer.index')" />

    <mt-nav-item label="Content" icon="regular-content">
      <mt-nav-item label="Shopping Experiences" :to="{ name: 'cms.index' }" :active="isCurrent('cms.index')" />
      <mt-nav-item label="Media" :to="{ name: 'media.index' }" :active="isCurrent('media.index')" />
    </mt-nav-item>

    <mt-nav-item label="Marketing" icon="regular-megaphone">
      <mt-nav-item label="Promotions" :to="{ name: 'promotion.index' }" :active="isCurrent('promotion.index')" />
      <mt-nav-item label="Newsletter recipients" :to="{ name: 'newsletter.index' }" :active="isCurrent('newsletter.index')" />
    </mt-nav-item>`;

const systemRows = `
    <mt-nav-item label="Extensions" icon="regular-plug">
      <mt-nav-item label="My extensions" :to="{ name: 'extension.my-extensions' }" :active="isCurrent('extension.my-extensions')" />
      <mt-nav-item label="Store" :to="{ name: 'extension.store' }" :active="isCurrent('extension.store')" />
    </mt-nav-item>

    <mt-nav-item label="Settings" icon="regular-cog" :to="{ name: 'settings.index' }" :active="isCurrent('settings.index')" />
    <mt-nav-item label="Docs" href="https://docs.shopware.com" target="_blank" />`;

const defaultTemplate = `
<mt-nav v-bind="args" @navigate="onNavigate">
  <mt-nav-section>${shopRows}
${systemRows}
  </mt-nav-section>
</mt-nav>`;

const sectionsTemplate = `
<mt-nav v-bind="args" @navigate="onNavigate">
  <mt-nav-section header="Shop">${shopRows}
  </mt-nav-section>

  <mt-nav-section header="System">${systemRows}
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
  ...createStory(defaultTemplate),
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
export const Sections: MtNavStory = createStory(sectionsTemplate);
