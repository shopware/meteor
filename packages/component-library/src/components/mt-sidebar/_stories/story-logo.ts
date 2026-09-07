import { defineComponent, h } from "vue";
import MtIcon from "../../mt-icon/mt-icon.vue";

/**
 * Example content for the `logo` slot. The `mt-sidebar__header-logo` class sizes the icon.
 */
export const StoryLogo = defineComponent({
  name: "StoryLogo",
  setup() {
    return () =>
      h(MtIcon, {
        class: "mt-sidebar__header-logo",
        name: "solid-shopware",
        "aria-label": "Shopware",
      });
  },
});
