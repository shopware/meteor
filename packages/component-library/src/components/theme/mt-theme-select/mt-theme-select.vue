<template>
  <mt-select
    class="mt-theme-select"
    :model-value="modelValue"
    :options="options"
    :label="label"
    :disabled="disabled"
    :hide-clearable-button="true"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtSelect from "../../form/mt-select/mt-select.vue";
import type { ColorScheme } from "../../../composables/useColorScheme";

withDefaults(
  defineProps<{
    /** The currently selected color scheme. */
    modelValue?: ColorScheme;
    /** The field label rendered above the select. */
    label?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: "system",
    label: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: ColorScheme];
}>();

const { t } = useI18n({
  messages: {
    en: {
      "mt-theme-select": {
        light: "Light",
        dark: "Dark",
        system: "System",
      },
    },
    de: {
      "mt-theme-select": {
        light: "Hell",
        dark: "Dunkel",
        system: "System",
      },
    },
  },
});

const options = computed<{ value: ColorScheme; label: string }[]>(() => [
  { value: "light", label: t("mt-theme-select.light") },
  { value: "dark", label: t("mt-theme-select.dark") },
  { value: "system", label: t("mt-theme-select.system") },
]);

const onUpdate = (value: unknown): void => {
  emit("update:modelValue", value as ColorScheme);
};
</script>
