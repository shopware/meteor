import { defineComponent, h } from "vue";
import MtActionMenuItem from "../../mt-action-menu-item/mt-action-menu-item.vue";

/**
 * Example content for the `user-actions` slot: a profile and a logout item.
 */
export const StoryUserActions = defineComponent({
  name: "StoryUserActions",
  emits: {
    action: (_name: "Profile" | "Logout") => true,
  },
  setup(_, { emit }) {
    return () => [
      h(
        MtActionMenuItem,
        { icon: "regular-user", onClick: () => emit("action", "Profile") },
        () => "Profile",
      ),
      h(
        MtActionMenuItem,
        { icon: "regular-sign-out", variant: "critical", onClick: () => emit("action", "Logout") },
        () => "Logout",
      ),
    ];
  },
});
