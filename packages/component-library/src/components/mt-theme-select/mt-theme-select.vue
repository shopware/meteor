<template>
  <mt-select
    class="mt-theme-select"
    :model-value="model"
    :options="options"
    :label="label"
    :disabled="disabled"
    hide-clearable-button
    @update:model-value="onSelect"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtSelect from "../mt-select/mt-select.vue";
import type { Theme } from "@/composables/useTheme";

const model = defineModel<Theme>({ default: "system" });

defineProps<{
  /**
   * The label for the select field itself.
   */
  label?: string;
  /**
   * Disables the select field.
   */
  disabled?: boolean;
}>();

const { t } = useI18n({
  messages: {
    en: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    de: {
      light: "Hell",
      dark: "Dunkel",
      system: "System",
    },
  },
});

const options = computed<{ value: Theme; label: string }[]>(() => [
  { value: "light", label: t("light") },
  { value: "dark", label: t("dark") },
  { value: "system", label: t("system") },
]);

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function onSelect(value: unknown): void {
  if (isTheme(value)) model.value = value;
}
</script>
