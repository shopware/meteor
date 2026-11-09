import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, onBeforeUnmount, ref, watchEffect } from "vue";
import MtNav from "../../mt-nav.vue";
import type { NavItem } from "../../mt-nav.vue";
import { StoryLink } from "../../mt-nav.story-helper";
import { items, routeName } from "../prototype-nav";
import "./item-hover.css";

/**
 * Prototype only: compares how the chevron of a row reacts while its panel is open in a horizontal
 * navigation. Hover or click a row with nested rows to open its panel. Nothing here is used by the
 * component itself.
 */

type Variant = "rotation" | "no-animation" | "simple";

type ItemHoverArgs = {
  variant: Variant;
  /** Plays every animation five times slower, to check how it feels */
  slowMotion: boolean;
};

const meta: Meta<ItemHoverArgs> = {
  title: "Components/Nav/Animation tests/Item hover",
  args: {
    slowMotion: false,
  },
  argTypes: {
    variant: { table: { disable: true } },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => ({
    components: { MtNav },
    setup() {
      const current = ref("product.index");
      const linkComponent = markRaw(StoryLink);
      const root = document.documentElement;

      watchEffect(() => {
        root.dataset.mtNavChevronMotion = args.variant;
        root.style.setProperty("--proto-motion-scale", args.slowMotion ? "5" : "1");
      });

      onBeforeUnmount(() => {
        delete root.dataset.mtNavChevronMotion;
        root.style.removeProperty("--proto-motion-scale");
      });

      function isActive(item: NavItem) {
        return routeName(item) === current.value;
      }

      function onNavigate(item: NavItem) {
        const name = routeName(item);

        if (name) {
          current.value = name;
        }
      }

      return { sections: [{ items }], linkComponent, isActive, onNavigate };
    },
    template: `
      <div style="min-height: 100vh; background: var(--color-elevation-surface-default);">
        <header
          style="
            padding: var(--scale-size-8) var(--scale-size-16);
            border-bottom: var(--scale-size-1) solid var(--color-border-secondary-default);
            background: var(--color-elevation-surface-raised);
          "
        >
          <mt-nav
            orientation="horizontal"
            :sections="sections"
            :link-component="linkComponent"
            :is-active="isActive"
            @navigate="onNavigate"
          />
        </header>
      </div>`,
  }),
};

export default meta;

type ItemHoverStory = StoryObj<ItemHoverArgs>;

/**
 * What ships today: the chevron turns half a circle to point up in 150ms on an ease-out.
 */
export const Rotation: ItemHoverStory = {
  args: { variant: "rotation" },
};

/**
 * The chevron keeps pointing down while the panel is open. The panel itself shows the row is open.
 */
export const NoAnimation: ItemHoverStory = {
  args: { variant: "no-animation" },
};

/**
 * The chevron points up at once while the panel is open, without turning.
 */
export const Simple: ItemHoverStory = {
  args: { variant: "simple" },
};
