<template>
  <li class="mt-breadcrumb-link" data-mt-breadcrumb="item">
    <component
      :is="as"
      class="mt-breadcrumb-link__anchor"
      v-bind="{ ...hrefAttribute, ...(to ? { ...$attrs, to } : $attrs) }"
      @click="$emit('click', $event)"
    >
      <slot />
    </component>
  </li>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useBreadcrumbLayout } from "./_internal/mt-breadcrumb-context";

const props = withDefaults(
  defineProps<{
    /**
     * The destination of the crumb. Passed to the rendered element as `to` for a
     * `router-link` and as `href` for a plain anchor.
     */
    to?: string | Record<string, unknown>;
    /**
     * The element or component that renders the crumb.
     */
    as?: string;
  }>(),
  {
    to: undefined,
    as: "router-link",
  },
);

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const hrefAttribute = computed(() => {
  if (props.as === "router-link") return {};

  return typeof props.to === "string" ? { href: props.to } : {};
});

useBreadcrumbLayout();
</script>

<style scoped>
.mt-breadcrumb-link {
  display: inline-flex;
  align-items: center;
  flex: 0 var(--mt-breadcrumb-shrink, 1) auto;
  min-width: min(var(--mt-breadcrumb-item-min-width), var(--mt-breadcrumb-natural-width, 0px));
}

.mt-breadcrumb-link[data-collapsed] {
  display: none;
}

.mt-breadcrumb-link[data-leading] {
  order: -2;
}

.mt-breadcrumb-link__anchor {
  display: block;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-text-secondary-default);
  text-decoration: none;
  cursor: pointer;
}

.mt-breadcrumb-link__anchor:is(:hover, :active) {
  text-decoration: underline;
}

.mt-breadcrumb-link__anchor:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
  border-radius: var(--border-radius-xs);
}
</style>
