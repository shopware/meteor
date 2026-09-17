import { defineComponent, h, type PropType, type VNode } from "vue";
import MtNavItem from "../mt-nav-item.vue";
import type { StoryNavItem } from "./entries";

/**
 * Renders one `mt-nav-item` per sample entry, nested via `children`, and marks the entry whose
 * route name equals `current` as active. Applications write the rows out in their template or
 * loop over their own data the same way.
 */
export const StoryNavItems = defineComponent({
  name: "StoryNavItems",
  props: {
    items: { type: Array as PropType<StoryNavItem[]>, required: true },
    current: { type: String, default: undefined },
  },
  setup(props) {
    function renderItems(items: StoryNavItem[]): VNode[] {
      return items.map((item) =>
        h(
          MtNavItem,
          {
            key: item.label,
            label: item.label,
            icon: item.icon,
            to: item.to,
            href: item.href,
            target: item.target,
            active: !!item.to && item.to.name === props.current,
          },
          item.children ? () => renderItems(item.children ?? []) : undefined,
        ),
      );
    }

    return () => renderItems(props.items);
  },
});
