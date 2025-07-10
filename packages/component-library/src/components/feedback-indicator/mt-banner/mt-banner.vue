<template>
  <div :class="classes" role="banner">
    <slot name="customIcon">
      <mt-icon
        v-if="!hideIcon"
        size="var(--scale-size-20)"
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
  --mt-banner-close-button-size: var(--scale-size-40);

  border-width: 1px;
  padding: var(--scale-size-24);
  border-style: solid;
  border-radius: var(--border-radius-xs);
  margin: 0 auto var(--scale-size-20);
  display: flex;
  flex-direction: row;
  gap: var(--scale-size-16);

  & ul {
    padding: var(--scale-size-8) 0 var(--scale-size-8) var(--scale-size-20);
  }
}

.mt-banner--future-remove-default-margin {
  margin-block-end: 0;
}

.mt-banner__title {
  margin-block-end: 0;
}

.mt-banner__body {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: var(--scale-size-4);
}

.mt-banner__icon {
  width: var(--scale-size-20);
  height: var(--scale-size-20);
}

.mt-banner__close {
  width: var(--mt-banner-close-button-size);
  height: var(--mt-banner-close-button-size);
  border-radius: var(--border-radius-xs);
  margin-top: calc(var(--scale-size-8) * -1);
  margin-right: calc(var(--scale-size-8) * -1);

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
