<template>
  <mt-button
    variant="tertiary"
    size="default"
    square
    :aria-label="t('toggle', { label })"
    :aria-expanded="expanded"
    :aria-controls="controls"
  >
    <mt-icon :name="icon" size="var(--scale-size-16)" decorative />
  </mt-button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";

/** The button that shows and hides a panel, or opens its drawer. */
defineProps<{
  /** The label of the panel. */
  label: string;
  icon: string;
  /** Whether the panel is open. */
  expanded: boolean;
  /** The id of the panel or of its drawer. */
  controls: string;
}>();

const { t } = useI18n({
  messages: {
    en: { toggle: "Toggle {label}" },
    de: { toggle: "{label} ein- oder ausblenden" },
  },
});
</script>
