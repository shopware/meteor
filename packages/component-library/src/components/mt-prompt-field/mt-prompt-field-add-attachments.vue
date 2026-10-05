<template>
  <mt-action-menu-item
    icon="regular-paperclip"
    :disabled="context.disabled.value"
    @select="context.openFileDialog()"
  >
    {{ label ?? t("label") }}
  </mt-action-menu-item>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtActionMenuItem from "@/components/mt-action-menu-item/mt-action-menu-item.vue";
import { usePromptFieldContext } from "./composables/usePromptFieldContext";

/**
 * A ready-made item for `mt-prompt-field-action-menu` that opens the file dialog of the
 * surrounding `mt-prompt-field`. The field needs `accept` to take files.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The text of the item. Defaults to a translated "Attach files". */
    label?: string;
  }>(),
  {
    label: undefined,
  },
);

const context = usePromptFieldContext("mt-prompt-field-add-attachments");

const { t } = useI18n({
  messages: {
    en: { label: "Attach files" },
    de: { label: "Dateien anhängen" },
  },
});
</script>
