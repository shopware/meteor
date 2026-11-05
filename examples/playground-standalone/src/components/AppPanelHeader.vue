<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtIcon,
  MtText,
  useApp,
  type MtAppPanel,
} from "@shopware-ag/meteor-component-library";

defineProps<{
  /** The shell's panel that the close button closes. */
  panel: MtAppPanel;
  title: string;
}>();

defineSlots<{
  /** An icon in front of the title. */
  icon?(): unknown;
  /** Icon buttons in front of the close button. */
  actions?(): unknown;
}>();

const { t } = useI18n();
const app = useApp();
</script>

<!-- As high as the header of mt-page, with the same buttons. -->
<template>
  <header class="app-panel-header">
    <slot name="icon" />
    <mt-text as="h2" size="s" weight="semibold" class="app-panel-header__title">
      {{ title }}
    </mt-text>

    <div class="app-panel-header__actions">
      <slot name="actions" />
      <!-- In the mobile layout, the drawer brings its own close button. -->
      <mt-button
        v-if="!app.isMobile.value"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('panel.close', { title })"
        @click="app.close(panel)"
      >
        <mt-icon name="regular-times" size="var(--scale-size-16)" decorative />
      </mt-button>
    </div>
  </header>
</template>

<style scoped>
.app-panel-header {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--scale-size-8);
  box-sizing: border-box;
  height: var(--scale-size-56);
  padding-inline: var(--scale-size-16) var(--scale-size-8);
  border-block-end: var(--scale-size-1) solid
    var(--color-border-secondary-default);
}

.app-panel-header__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-panel-header__actions {
  display: flex;
  flex: none;
  margin-inline-start: auto;
}
</style>
