import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, onBeforeUnmount, ref, watchEffect } from "vue";
import MtNav from "../../mt-nav.vue";
import type { NavItem } from "../../mt-nav.vue";
import { StoryLink } from "../../mt-nav.story-helper";
import { items, routeName } from "../prototype-nav";
import "./flyout-motion.css";

/**
 * Prototype only: compares opening animations for the floating panel of a horizontal navigation.
 * Hover or click a row with nested rows to open its panel, then move along the bar to see how a
 * panel takes over from an open one. Nothing here is used by the component itself.
 */

type Variant = "horizontal-slide" | "fade" | "grow" | "cascade";

type FlyoutMotionArgs = {
  variant: Variant;
  /** Plays every animation five times slower, to check how it feels */
  slowMotion: boolean;
};

const meta: Meta<FlyoutMotionArgs> = {
  title: "Components/Nav/Animation tests/Popover animation",
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

      // The panel is teleported to the body, so the variant is set on <html> where its styles reach it
      watchEffect(() => {
        root.dataset.mtNavFlyoutMotion = args.variant;
        root.style.setProperty("--proto-motion-scale", args.slowMotion ? "5" : "1");
      });

      // Records the last input, so a panel opened from the keyboard can skip its animation
      function onKeyboardInput() {
        root.dataset.protoInput = "keyboard";
      }

      function onPointerInput() {
        if (root.dataset.protoInput !== "pointer") {
          root.dataset.protoInput = "pointer";
        }
      }

      document.addEventListener("keydown", onKeyboardInput, true);
      document.addEventListener("pointerdown", onPointerInput, true);
      document.addEventListener("pointermove", onPointerInput, true);

      onBeforeUnmount(() => {
        document.removeEventListener("keydown", onKeyboardInput, true);
        document.removeEventListener("pointerdown", onPointerInput, true);
        document.removeEventListener("pointermove", onPointerInput, true);
        delete root.dataset.mtNavFlyoutMotion;
        delete root.dataset.protoInput;
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

type FlyoutMotionStory = StoryObj<FlyoutMotionArgs>;

/**
 * What ships today: a 300ms fade with a 4px drop on the iOS drawer curve, also when opened from
 * the keyboard. A panel taking over from an open one slides in sideways instead.
 */
export const HorizontalSlide: FlyoutMotionStory = {
  args: { variant: "horizontal-slide" },
};

/**
 * Opacity only, 150ms. Nothing moves, so it's the quietest option for a menu opened many times a
 * day. Like every new variant, it appears at once when opened from the keyboard or when taking
 * over from an open panel.
 */
export const Fade: FlyoutMotionStory = {
  args: { variant: "fade" },
};

/**
 * Scales from 97% out of the corner where its row is, in 200ms. Reads as the panel coming out of
 * the row. Appears at once from the keyboard or when taking over from an open panel.
 */
export const Grow: FlyoutMotionStory = {
  args: { variant: "grow" },
};

/**
 * The panel fades in within 150ms and its rows follow 30ms apart, each moving 4px away from the
 * row, all done within 240ms. The most noticeable option, and the one most likely to tire on a
 * menu opened this often. Appears at once from the keyboard or when taking over from an open panel.
 */
export const Cascade: FlyoutMotionStory = {
  args: { variant: "cascade" },
};
