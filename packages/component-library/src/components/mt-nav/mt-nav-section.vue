<template>
  <div class="mt-nav__section">
    <mt-text
      v-if="header"
      :id="headerId"
      as="h3"
      class="mt-nav__section-header mt-nav__hide-on-collapse"
      size="2xs"
      weight="semibold"
      color="color-text-secondary-default"
      :title="header"
    >
      {{ header }}
    </mt-text>

    <ul class="mt-nav__list" :aria-labelledby="header ? headerId : undefined">
      <mt-nav-item v-for="item in prunedItems" :key="item.id || item.path" :item="item">
        <template #item-suffix="slotProps">
          <slot name="item-suffix" v-bind="slotProps" />
        </template>
      </mt-nav-item>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useId, type PropType } from "vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtNavItem from "./_internal/mt-nav-item.vue";
import { NAV_CONTEXT } from "./_internal/mt-nav-context";
import { navItemKey } from "./_internal/nav-item-key";
import type { NavItem } from "./mt-nav.types";

const MAX_NESTING_LEVEL = 3;

const props = defineProps({
  /**
   * Heading above the items of the section. Hidden while the navigation is collapsed.
   */
  header: {
    type: String,
    default: undefined,
  },
  /**
   * Top level items of the section, nested via `children` up to three levels deep.
   */
  items: {
    type: Array as PropType<NavItem[]>,
    required: true,
  },
});

defineSlots<{
  /** Rendered after the label of every item, e.g. for a badge or counter. */
  "item-suffix"?: (props: { item: NavItem }) => unknown;
}>();

const context = inject(NAV_CONTEXT);

if (!context) {
  throw new Error("mt-nav-section must be rendered inside mt-nav");
}

const headerId = `mt-nav-section-header-${useId()}`;

const prunedItems = computed(() => pruneDeepItems(props.items));

const unregisterItems = context.registerItems(prunedItems);

onBeforeUnmount(unregisterItems);

function pruneDeepItems(items: NavItem[], level = 1): NavItem[] {
  return items.map((item) => {
    const children = item.children ?? [];

    if (level < MAX_NESTING_LEVEL) {
      return { ...item, children: pruneDeepItems(children, level + 1) };
    }

    // Nesting beyond level 3 is unsupported: report it and drop the children.
    children.forEach((child) => {
      console.error(
        `[mt-nav] The navigation item "${navItemKey(child)}" is nested on level 4 or higher. ` +
          "The navigation only supports up to three levels of nesting.",
      );
    });

    return { ...item, children: [] };
  });
}
</script>

<style lang="scss">
.mt-nav__section {
  display: flex;
  flex-direction: column;
}

// Typography comes from mt-text; the fixed height keeps the rows in place when the header fades out
.mt-nav__section-header {
  height: var(--scale-size-24);
  margin: 0 0 var(--scale-size-4);
  padding: 0 var(--scale-size-10);
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mt-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
