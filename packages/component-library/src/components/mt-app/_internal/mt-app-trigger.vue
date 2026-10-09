<template>
  <mt-button
    class="mt-app__trigger"
    :class="`mt-app__trigger--${panel}`"
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
import type { MtAppPanel } from "../composables/useMtApp";

/**
 * The header button that opens the drawer of a panel in the mobile layout.
 */
defineProps<{
  panel: MtAppPanel;
  /** The accessible name of the button. */
  label: string;
  /** Whether the drawer is open. */
  expanded: boolean;
  /** The id of the drawer. */
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

.mt-app__trigger--sidebar {
  margin-inline-start: auto;
}
</style>
