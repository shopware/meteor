import { defineComponent, h, type PropType } from "vue";
import type { SidebarRoute } from "../mt-sidebar.types";

/**
 * Page frame around the sidebar: a full-height flex row with a main area showing the current route.
 */
export const StoryLayout = defineComponent({
  name: "StoryLayout",
  props: {
    route: { type: Object as PropType<SidebarRoute>, required: true },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        {
          style: {
            height: "100vh",
            display: "flex",
            background: "var(--color-elevation-surface-default)",
          },
        },
        [
          slots.default?.(),
          h(
            "main",
            {
              style: {
                flex: "1",
                padding: "var(--scale-size-32)",
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-primary-default)",
              },
            },
            ["Current route: ", h("code", props.route.name)],
          ),
        ],
      );
  },
});
