<template>
  <component
    :is="as"
    :class="[
      'mt-link',
      `mt-link--${variant}`,
      {
        'mt-link--disabled': disabled,
        [`mt-link--${type}`]: type !== undefined,
      },
    ]"
    :role="as === 'a' ? 'link' : undefined"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    v-bind="{ ...hrefAttribute, ...(to ? { ...$attrs, to } : $attrs) }"
    @click.capture="onClickCapture"
    @click="disabled ? undefined : $emit('click', $event)"
  >
    <slot />

    <mt-icon
      v-if="type"
      size="0.75em"
      :name="type === 'external' ? 'regular-external-link-s' : 'regular-long-arrow-right'"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";

const props = withDefaults(
  defineProps<{
    to?: string | Record<string, unknown>;
    as?: string;
    variant?: "primary" | "critical";
    disabled?: boolean;
    type?: "external" | "internal";
  }>(),
  {
    as: "router-link",
    variant: "primary",
    disabled: false,
  },
);

const hrefAttribute = computed(() => {
  // `href: undefined` falls through and strips the `href` a disabled router-link resolved from `to`.
  if (props.disabled) return { href: undefined };
  // Binding `href` here at all would clobber the one `router-link` resolves itself.
  if (props.as === "router-link") return {};

  // A route location object would stringify to "[object Object]" in an href.
  return typeof props.to === "string" ? { href: props.to } : {};
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

// Runs before `router-link`'s own click listener, whose guard skips default-prevented events.
function onClickCapture(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
}
</script>

<style scoped>
.mt-link {
  display: inline-flex;
  column-gap: 0.25em;
  align-items: center;
  cursor: pointer;
  margin: 0;
  font-family: var(--font-family-body);
  text-decoration: underline;

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid var(--color-border-brand-default);
    border-radius: var(--border-radius-xs);
  }
}

.mt-link:is(:disabled, .mt-link--disabled) {
  cursor: not-allowed;
}

.mt-link--primary {
  color: var(--color-text-brand-default);
}

.mt-link--primary:is(:hover, :active) {
  color: var(--color-text-brand-hover);
}

.mt-link--primary:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-brand-disabled);
}

.mt-link--critical {
  color: var(--color-text-critical-default);
}

.mt-link--critical:is(:hover, :active) {
  color: var(--color-text-critical-hover);
}

.mt-link--critical:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-critical-disabled);
}
</style>
