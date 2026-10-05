<template>
  <mt-collapsible-trigger class="mt-chain-of-thought-header">
    <mt-text as="span" size="xs" color="color-text-secondary-default">
      <slot>{{ t("label") }}</slot>
    </mt-text>
    <mt-icon
      name="regular-chevron-down-xs"
      size="10"
      decorative
      class="mt-chain-of-thought-header__chevron"
    />
  </mt-collapsible-trigger>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * Opens and closes `mt-chain-of-thought`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** The label, such as "Worked for 12 seconds". Defaults to a translated "Chain of thought". */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { label: "Chain of thought" },
    de: { label: "Gedankengang" },
  },
});
</script>

<style scoped>
.mt-chain-of-thought-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.mt-chain-of-thought-header:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-chain-of-thought-header__chevron {
  flex-shrink: 0;
  color: var(--color-icon-primary-default);
}

.mt-chain-of-thought-header__chevron {
  transition: transform 0.15s ease;
}

.mt-chain-of-thought-header[data-state="open"] .mt-chain-of-thought-header__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .mt-chain-of-thought-header__chevron {
    transition: none;
  }
}
</style>
