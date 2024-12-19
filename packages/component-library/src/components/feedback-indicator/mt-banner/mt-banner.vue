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
import { useI18n } from "@/composables/useI18n";

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
  border-style: solid;
  border-radius: var(--border-radius-xs);
  position: relative;
  margin: 0 auto var(--scale-size-20);

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
  padding: var(--scale-size-24) var(--scale-size-60) var(--scale-size-24) var(--scale-size-24);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--scale-size-4);
}

.mt-banner__body--icon {
  padding: var(--scale-size-24) var(--scale-size-60);
}

.mt-banner__body--closable {
  padding-right: var(--mt-banner-close-button-size);
}

.mt-banner__icon {
  position: absolute;
  display: block;
  left: var(--scale-size-26);
  top: var(--scale-size-28);
  width: var(--scale-size-20);
  height: var(--scale-size-20);
}

.mt-banner__close {
  width: var(--mt-banner-close-button-size);
  height: var(--mt-banner-close-button-size);
  line-height: var(--mt-banner-close-button-size);
  position: absolute;
  display: block;
  top: var(--scale-size-12);
  right: var(--scale-size-12);
  padding: 0;
  margin: 0;
  text-align: center;
  background: none;
  border: 0 none;
  outline: none;
  cursor: pointer;
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
