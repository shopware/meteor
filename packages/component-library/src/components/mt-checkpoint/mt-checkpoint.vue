<template>
  <div class="mt-checkpoint">
    <div class="mt-checkpoint__content">
      <slot />
    </div>
    <mt-divider class="mt-checkpoint__line" />
  </div>
</template>

<script setup lang="ts">
import MtDivider from "@/components/mt-divider/mt-divider.vue";

/**
 * A marker between the messages of a conversation, such as "Switched to another model",
 * "Earlier messages summarized" or a point to restore the conversation to. Holds a
 * `mt-checkpoint-icon`, a label and an optional `mt-checkpoint-trigger`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** `mt-checkpoint-icon`, the label and `mt-checkpoint-trigger`. */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-checkpoint {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-checkpoint__content {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  flex-shrink: 0;
}

.mt-checkpoint__line {
  flex: 1;
}
</style>
