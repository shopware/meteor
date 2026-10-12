<template>
  <div class="mt-sidebar-header">
    <div class="mt-sidebar-header__logo">
      <!-- @slot Logo next to the title. Defaults to the Shopware logo -->
      <slot name="logo">
        <div class="mt-sidebar-header__default-logo">
          <mt-icon
            name="solid-shopware"
            size="var(--scale-size-26)"
            color="var(--color-static-white)"
            :aria-label="t('logoLabel')"
          />
        </div>
      </slot>
    </div>

    <div class="mt-sidebar-header__text">
      <mt-text as="div" size="s" weight="semibold" class="mt-sidebar-header__title" :title="title">
        {{ title }}
      </mt-text>
      <mt-text
        v-if="subtitle"
        as="div"
        size="2xs"
        color="color-text-secondary-default"
        class="mt-sidebar-header__subtitle"
      >
        {{ subtitle }}
      </mt-text>
    </div>

    <mt-button
      v-if="collapsible"
      class="mt-sidebar-header__collapse"
      variant="tertiary"
      size="default"
      square
      :aria-label="collapseLabel ?? t('collapseLabel')"
      @click="emit('collapse')"
    >
      <template #iconFront>
        <mt-icon name="regular-panel-left" size="var(--scale-size-16)" decorative />
      </template>
    </mt-button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

withDefaults(
  defineProps<{
    /**
     * Main line next to the logo, for example the name of the shop. Cut off with an ellipsis when too long.
     */
    title: string;
    /**
     * Second line below the title, for example the name of the product.
     */
    subtitle?: string;
    /**
     * Shows the button that collapses the sidebar.
     */
    collapsible?: boolean;
    /**
     * Accessible name of the collapse button. Defaults to the translated "Minimize menu".
     */
    collapseLabel?: string;
  }>(),
  {
    subtitle: undefined,
    collapsible: true,
    collapseLabel: undefined,
  },
);

const emit = defineEmits<{
  /**
   * Emitted when the collapse button is clicked.
   */
  (e: "collapse"): void;
}>();

defineSlots<{
  logo?: null;
}>();

const { t } = useI18n({
  messages: {
    en: {
      logoLabel: "Shopware",
      collapseLabel: "Minimize menu",
    },
    de: {
      logoLabel: "Shopware",
      collapseLabel: "Menü minimieren",
    },
  },
});
</script>

<style scoped>
.mt-sidebar-header {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
}

.mt-sidebar-header__logo {
  display: flex;
  flex-shrink: 0;
}

.mt-sidebar-header__default-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  background: var(--color-icon-brand-default);
  border-radius: var(--border-radius-m);
}

.mt-sidebar-header__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.mt-sidebar-header__title,
.mt-sidebar-header__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mt-sidebar-header__collapse {
  flex-shrink: 0;
}
</style>
