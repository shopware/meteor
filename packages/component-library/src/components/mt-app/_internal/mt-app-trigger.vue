<template>
  <mt-button
    class="mt-app__trigger"
    :class="`mt-app__trigger--${side}`"
    variant="tertiary"
    size="default"
    square
    :aria-label="label"
    :aria-expanded="expanded ? 'true' : 'false'"
    :aria-controls="controls"
    @click="$emit('click')"
  >
    <mt-icon :name="icon" size="var(--scale-size-16)" decorative />
  </mt-button>
</template>

<script setup lang="ts">
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import type { MtAppSide } from "../composables/useAppLayout";

/**
 * The header button that opens one of the shell's drawers in the mobile layout.
 */
defineProps<{
  side: MtAppSide;
  /** the accessible name of the button */
  label: string;
  /** whether the controlled drawer is open */
  expanded: boolean;
  /** the id of the drawer element */
  controls: string;
  icon: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped>
.mt-app__trigger {
  flex: none;
}

.mt-app__trigger--end {
  margin-inline-start: auto;
}
</style>
