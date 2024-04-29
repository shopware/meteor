<template>
  <div v-if="!!error" class="mt-field__error" aria-label="Error message">
    <mt-icon name="solid-exclamation-circle" />
    {{ errorMessage }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";

export default defineComponent({
  name: "MtFieldError",

  i18n: {
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
  },

  components: {
    "mt-icon": MtIcon,
  },

  props: {
    error: {
      type: Object,
      required: false,
      default: null,
    },
  },

  computed: {
    errorMessage(): string {
      if (!this.error) {
        return "";
      }

      const translationKey = `mt-field-error.${this.error.code}`;
      const translation = this.$tc(translationKey, 1, this.error.parameters || {});

      if (translation === translationKey) {
        return this.error.detail;
      }
      return translation;
    },
  },
});
</script>

<style lang="scss">
.mt-field__error {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: $font-size-extra-small;
  line-height: 1.25;
  color: var(--color-text-critical-default);

  #meteor-icon-kit__solid-exclamation-circle {
    width: 12px;
    height: 12px;
    color: var(--color-icon-critical-default);
  }
}
</style>
