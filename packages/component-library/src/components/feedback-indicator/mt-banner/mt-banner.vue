<template>
  <div :class="classes" role="banner">
    <slot name="customIcon">
      <mt-icon
        v-if="!hideIcon"
        size="1.25rem"
        class="mt-banner__icon"
        :name="bannerIcon"
        decorative
      />
    </slot>

    <div class="mt-banner__body" :class="bodyClasses">
      <mt-text v-if="title" as="h3" weight="bold" size="xs" class="mt-banner__title">
        {{ title }}
      </mt-text>

      <div class="mt-banner__message">
        <slot />
      </div>
    </div>

    <button
      v-if="closable"
      class="mt-banner__close"
      :aria-label="t('close')"
      @click.prevent="$emit('close', bannerIndex)"
    >
      <mt-icon name="solid-times-s" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  messages: {
    de: {
      close: "Schließen",
    },
    en: {
      close: "Close",
    },
  },
});

const props = withDefaults(
  defineProps<{
    variant?: "neutral" | "info" | "attention" | "critical" | "positive" | "inherited";
    title?: string;
    hideIcon?: boolean;
    closable?: boolean;
    bannerIndex?: string;
    icon?: string;
  }>(),
  {
    variant: "neutral",
    hideIcon: false,
    closable: false,
  },
);

defineEmits<{
  close: [bannerIndex?: string];
}>();

const bannerIcon = computed(() => {
  if (props.icon) return props.icon;

  const iconConfig = {
    neutral: "solid-info-circle",
    info: "solid-info-circle",
    attention: "solid-exclamation-triangle",
    critical: "solid-exclamation-circle",
    positive: "solid-check-circle",
    inherited: "solid-link",
  };

  return iconConfig[props.variant] || "solid-info-circle";
});

const future = useFutureFlags();

const classes = computed(() => [
  "mt-banner",
  `mt-banner--${props.variant}`,
  {
    "mt-banner--future-remove-default-margin": future.removeDefaultMargin,
    "mt-banner--icon": !props.hideIcon,
    "mt-banner--closable": props.closable,
  },
]);

const bodyClasses = computed(() => ({
  "mt-banner__body--icon": !props.hideIcon,
  "mt-banner__body--closable": props.closable,
}));
</script>

<style scoped>
.mt-banner {
  --mt-banner-close-button-size: 2.5rem;

  border-width: 1px;
  border-style: solid;
  border-radius: var(--border-radius-xs);
  position: relative;
  margin: 0 auto 1.25rem;

  & ul {
    padding: 0.5rem 0 0.5rem 1.25rem;
  }
}

.mt-banner--future-remove-default-margin {
  margin-block-end: 0;
}

.mt-banner__title {
  margin-block-end: 0;
}

.mt-banner__body {
  padding: 1.5rem 3.75rem 1.5rem 1.5rem;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.mt-banner__body--icon {
  padding: 1.5rem 3.75rem;
}

.mt-banner__body--closable {
  padding-right: var(--mt-banner-close-button-size);
}

.mt-banner__icon {
  position: absolute;
  display: block;
  left: 1.625rem;
  top: 1.75rem;
  width: 1.25rem;
  height: 1.25rem;
}

.mt-banner__close {
  width: var(--mt-banner-close-button-size);
  height: var(--mt-banner-close-button-size);
  line-height: var(--mt-banner-close-button-size);
  position: absolute;
  display: block;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0;
  margin: 0;
  text-align: center;
  background: none;
  border: 0 none;
  outline: none;
  cursor: pointer;
  border-radius: var(--border-radius-xs);

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-banner--info {
  border-color: var(--color-border-brand-selected);
  background-color: var(--color-background-brand-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-brand-default);
  }
}

.mt-banner--attention {
  border-color: var(--color-border-attention-default);
  background-color: var(--color-background-attention-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-attention-default);
  }
}

.mt-banner--critical {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-critical-default);
  }
}

.mt-banner--positive {
  border-color: var(--color-border-positive-default);
  background-color: var(--color-background-positive-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-positive-default);
  }
}

.mt-banner--inherited {
  border-color: var(--color-border-accent-default);
  background-color: var(--color-background-accent-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-accent-default);
  }
}

.mt-banner--neutral {
  border-color: var(--color-border-primary-default);
  background-color: var(--color-elevation-surface-overlay);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-primary-default);
  }
}
</style>
