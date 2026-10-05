<template>
  <mt-button :variant="variant">
    <slot />
  </mt-button>
</template>

<script setup lang="ts">
import MtButton from "@/components/mt-button/mt-button.vue";

/**
 * A button in `mt-confirmation-actions`. Answer the approval in its `click` handler, for example
 * with the AI SDK's `addToolApprovalResponse({ id: approval.id, approved: true })`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The look of the button: `primary` for the approving action, `secondary` for the other. */
    variant?: "primary" | "secondary" | "critical";
  }>(),
  {
    variant: "secondary",
  },
);

defineSlots<{
  /** The label of the button. */
  default?(): unknown;
}>();
</script>
