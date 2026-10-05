<template>
  <div class="mt-message-actions">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * The actions of a message, such as copy, retry and feedback, as a row of `mt-message-action`s.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** `mt-message-action` buttons. */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-message-actions {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
}
</style>
