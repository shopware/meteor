import { defineComponent, h, type PropType } from "vue";

/**
 * Stands in for `router-link`: Storybook has no router, so the link only prevents the navigation.
 * Consumers pass `router-link` (the default) or their own link component instead.
 */
export const StoryLink = defineComponent({
  name: "StoryLink",
  props: {
    to: { type: Object as PropType<{ name?: string }>, required: true },
    activeClass: { type: String, default: "" },
    exactActiveClass: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "a",
        {
          href: `#${props.to.name ?? ""}`,
          onClick: (event: MouseEvent) => event.preventDefault(),
        },
        slots.default?.(),
      );
  },
});
