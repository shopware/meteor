<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtIcon,
  MtText,
  useMtApp,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const { isMobile, isOpen, toggle } = useMtApp();
</script>

<template>
  <div class="app-header" :class="{ 'app-header--mobile': isMobile }">
    <mt-text as="span" size="s" weight="semibold">{{ t("app.title") }}</mt-text>

    <mt-button
      v-if="!isMobile"
      variant="tertiary"
      square
      :aria-label="t('app.toggleSidebar')"
      :aria-pressed="isOpen('sidebar')"
      @click="toggle('sidebar')"
    >
      <template #iconFront>
        <mt-icon
          name="regular-panel-right"
          size="var(--scale-size-16)"
          decorative
        />
      </template>
    </mt-button>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--scale-size-56);
  padding-inline: var(--scale-size-8);
}

.app-header--mobile {
  padding-inline: 0;
}
</style>
