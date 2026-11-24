<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtButton, MtIcon } from "@shopware-ag/meteor-component-library";

/** The help and notification buttons at the end of every page header. */
const { t } = useI18n();
</script>

<template>
  <mt-button variant="tertiary" size="default" square :aria-label="t('header.help')">
    <mt-icon name="regular-question-circle" size="var(--scale-size-16)" decorative />
  </mt-button>
  <mt-button
    class="app-header-actions__notifications"
    variant="tertiary"
    size="default"
    square
    :aria-label="t('header.notifications')"
  >
    <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
  </mt-button>
</template>

<style scoped>
.app-header-actions__notifications {
  position: relative;
}

/* An unread notification. */
.app-header-actions__notifications::after {
  content: "";
  position: absolute;
  inset-block-start: var(--scale-size-6);
  inset-inline-end: var(--scale-size-6);
  width: var(--scale-size-6);
  height: var(--scale-size-6);
  background-color: var(--color-icon-critical-default);
  border-radius: 50%;
}
</style>
