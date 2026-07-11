<template>
  <div
    :class="[
      'mt-divider',
      `mt-divider--${orientation}`,
      `mt-divider--${variant}`,
      {
        'mt-divider--with-content': !!$slots.default,
        'mt-divider--full-bleed': fullBleed,
      },
    ]"
    :style="{ '--mt-divider-color': `var(--${color})` }"
    :role="role"
    :aria-orientation="role === 'separator' ? orientation : undefined"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    variant?: "solid" | "dashed";
    color?: string;
    decorative?: boolean;
    fullBleed?: boolean;
  }>(),
  {
    orientation: "horizontal",
    variant: "solid",
    color: "color-border-secondary-default",
    decorative: false,
    fullBleed: false,
  },
);

const slots = useSlots();

// A separator treats its children as presentational, hiding them from
// assistive technologies, so with slot content no role is set and the
// content is exposed on its own.
const role = computed(() => {
  if (slots.default) return undefined;

  return props.decorative ? "none" : "separator";
});

defineSlots<{
  default?: null;
}>();
</script>

<style>
.mt-divider {
  display: flex;
  align-items: center;
}

.mt-divider--horizontal {
  width: 100%;
}

.mt-divider--vertical {
  height: 100%;
  flex-direction: column;
}

.mt-divider--horizontal.mt-divider--full-bleed {
  width: auto;
  margin-inline: calc(var(--scale-size-24) * -1);
}

.mt-divider--vertical.mt-divider--full-bleed {
  height: auto;
  margin-block: calc(var(--scale-size-24) * -1);
}

.mt-divider--with-content {
  gap: var(--scale-size-16);
}

.mt-divider::before,
.mt-divider--with-content::after {
  content: "";
  flex: 1 1 0;
  border: 0 solid var(--mt-divider-color);
}

.mt-divider--dashed::before,
.mt-divider--dashed.mt-divider--with-content::after {
  border-style: dashed;
}

.mt-divider--horizontal::before,
.mt-divider--horizontal.mt-divider--with-content::after {
  border-top-width: 1px;
}

.mt-divider--vertical::before,
.mt-divider--vertical.mt-divider--with-content::after {
  border-left-width: 1px;
}
</style>
