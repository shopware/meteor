<template>
  <div class="mt-app__trigger" :class="`mt-app__trigger--${side}`">
    <mt-button
      ref="buttonRef"
      variant="tertiary"
      size="small"
      square
      :aria-label="label"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-controls="controls"
      @click="$emit('click')"
    >
      <mt-icon :name="icon" size="var(--scale-size-16)" decorative />
    </mt-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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

const buttonRef = ref<InstanceType<typeof MtButton> | null>(null);

/** the button element; the shell restores the focus to it when the drawer closes */
const element = computed<HTMLElement | null>(
  () => (buttonRef.value?.$el as HTMLElement | undefined) ?? null,
);

defineExpose({ element });
</script>

<style scoped>
.mt-app__trigger {
  flex: none;
  padding: var(--scale-size-8);
}

/* a lone end trigger (no header content, no start sidebar) still sits at the end */
.mt-app__trigger--end {
  margin-inline-start: auto;
}
</style>
