import { defineComponent, h } from "vue";
import MtButton from "../../mt-button/mt-button.vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtText from "../../mt-text/mt-text.vue";

/**
 * Example content for the `footer` slot, replacing the default user block with a logout button.
 * `mt-sidebar__hide-on-collapse` fades the texts out when the sidebar collapses.
 */
export const StoryFooter = defineComponent({
  name: "StoryFooter",
  props: {
    userName: { type: String, required: true },
  },
  emits: {
    logout: () => true,
  },
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--scale-size-8)",
            padding: "var(--scale-size-8)",
          },
        },
        [
          h(
            MtText,
            {
              class: "mt-sidebar__hide-on-collapse",
              size: "2xs",
              color: "color-text-secondary-default",
            },
            () => `Signed in as ${props.userName}`,
          ),
          h(
            MtButton,
            { variant: "secondary", size: "small", block: true, onClick: () => emit("logout") },
            {
              iconFront: () => h(MtIcon, { name: "regular-sign-out", size: "12px" }),
              default: () => h("span", { class: "mt-sidebar__hide-on-collapse" }, "Logout"),
            },
          ),
        ],
      );
  },
});
