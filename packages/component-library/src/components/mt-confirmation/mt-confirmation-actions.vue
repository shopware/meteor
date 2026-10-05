<template>
  <div v-if="state === 'approval-requested'" class="mt-confirmation-actions">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useConfirmationContext } from "./confirmation-context";

/**
 * The buttons of `mt-confirmation`, such as Decline and Approve. Shown while the approval is
 * requested.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** `mt-confirmation-action` buttons. */
  default?(): unknown;
}>();

const { state } = useConfirmationContext("mt-confirmation-actions");
</script>

<style scoped>
.mt-confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
