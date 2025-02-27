<template>
  <mt-text
    v-if="!!error"
    as="span"
    size="xs"
    color="color-text-critical-default"
    class="mt-field__error"
  >
    <mt-icon name="solid-exclamation-circle" size="0.75rem" aria-hidden="true" />

    {{ errorMessage }}
  </mt-text>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  error?: Record<string, any> | null;
}>();

const errorMessage = computed(() => {
  if (!props.error) return "";

  if (!props.error.code) {
    return t(props.error?.detail ?? "");
  }

  const translation = t(props.error.code, props.error.parameters || {});
  const noTranslationFound = translation === props.error.code.toString();

  return noTranslationFound ? props.error.detail : translation;
});

const { t } = useI18n({
  messages: {
    en: {
      "mt-field-error": {
        FRAMEWORK__MISSING_PRIVILEGE_ERROR: "Missing permissions",
        FRAMEWORK__DELETE_RESTRICTED: "Deletion failed",
        INVALID_MEDIA_URL: "Please enter a valid URL to upload a file.",
        CONTENT__MISSING_RULE_TYPE_EXCEPTION: "You must choose a type for this rule.",
        CONTENT__INVALID_CATEGORY_TYPE_AS_ENTRY_POINT:
          "The type can not be assigned while category is an entry point.",
        SHOPWARE_INVALID_IP: "Please enter a valid IP address.",
        INVALID_URL: "Please enter a valid url.",
        INVALID_MAIL: "Please enter a valid email address.",
        FRAMEWORK__RATE_LIMIT_EXCEEDED:
          "Too many requests. Please wait {seconds} seconds before trying again.",
        DUPLICATED_URL: "This URL is already in use. Please choose another URL.",
        "c1051bb4-d103-4f74-8988-acbcafc7fdc3": "This field must not be empty.",
      },
    },
    de: {
      "mt-field-error": {
        FRAMEWORK__MISSING_PRIVILEGE_ERROR: "Fehlende Berechtigungen",
        FRAMEWORK__DELETE_RESTRICTED: "Löschen fehlgeschlagen",
        INVALID_MEDIA_URL: "Bitte gib eine gültige URL ein, um eine Datei hochzuladen.",
        CONTENT__MISSING_RULE_TYPE_EXCEPTION: "Du musst einen Typ für diese Regel auswählen.",
        CONTENT__INVALID_CATEGORY_TYPE_AS_ENTRY_POINT:
          "Dieser Typ kann nicht gewählt werden, während die Kategorie als Einstiegspunkt festgelegt ist.",
        SHOPWARE_INVALID_IP: "Bitte gib eine gültige IP-Adresse ein.",
        INVALID_URL: "Bitte gib eine gültige URL ein.",
        INVALID_MAIL: "Bitte gib eine gültige E-Mail-Adresse ein.",
        FRAMEWORK__RATE_LIMIT_EXCEEDED:
          "Zu viele Anfragen. Bitte warten Sie {seconds} Sekunden, bevor Sie es erneut versuchen.",
        DUPLICATED_URL: "Diese URL wird bereits genutzt. Bitte wähle eine andere Domain.",
        "c1051bb4-d103-4f74-8988-acbcafc7fdc3": "Dieses Feld darf nicht leer sein",
      },
    },
  },
});
</script>

<style scoped>
.mt-field__error {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  margin-top: var(--scale-size-4);
  color: var(--color-icon-critical-default);
}
</style>
