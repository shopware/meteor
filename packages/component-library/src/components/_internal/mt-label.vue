<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <span class="mt-label" :class="labelClasses" @click.stop="$emit('selected')" tabindex="0">
    <mt-color-badge v-if="appearance === 'badged'" :variant="variant" :rounded="true" />

    <span class="mt-label__caption">
      <slot />
    </span>

    <button
      v-if="showDismissable"
      class="mt-label__dismiss"
      :title="t('remove')"
      @click.prevent.stop="$emit('dismiss')"
    >
      <slot name="dismiss-icon">
        <mt-icon data-testid="dismiss-label" name="regular-times-xxs" />
      </slot>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import MtIcon from "../icons-media/mt-icon/mt-icon.vue";
import MtColorBadge from "../feedback-indicator/mt-color-badge/mt-color-badge.vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    variant?: "info" | "danger" | "success" | "warning" | "neutral" | "primary";
    size?: "small" | "medium" | "default";
    appearance?: "default" | "pill" | "circle" | "badged";
    ghost?: boolean;
    caps?: boolean;
    dismissable?: boolean;
  }>(),
  {
    // @ts-expect-error
    variant: "",
    size: "default",
    appearance: "default",
    ghost: false,
    caps: false,
  },
);

const { t } = useI18n({
  messages: {
    en: {
      remove: "Remove",
    },
    de: {
      remove: "Entfernen",
    },
  },
});

const attrs = useAttrs();
const showDismissable = computed(() => !!attrs.onDismiss && props.dismissable);

const labelClasses = computed(() => {
  return [
    `mt-label--appearance-${props.appearance}`,
    `mt-label--size-${props.size}`,
    {
      [`mt-label--${props.variant}`]: !!props.variant,
      "mt-label--dismissable": showDismissable,
      "mt-label--ghost": props.ghost,
      "mt-label--caps": props.caps,
    },
  ];
});
</script>

<style lang="scss">
@mixin mt-label-variant($color-background, $color-text, $color-border, $color-border-normal) {
  background-color: $color-background;
  border-color: $color-border-normal;
  color: $color-text;

  &.mt-label--small::before {
    background: $color-border;
  }

  .mt-label__dismiss {
    color: $color-text;

    .mt-icon {
      color: $color-text;
    }
  }

  &.mt-label--ghost {
    background: transparent;
    border-color: $color-border;
  }

  &.mt-label--dismissable:hover {
    border-color: $color-border;
  }
}

.mt-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
  min-width: 56px;
  margin: 0 var(--scale-size-6) var(--scale-size-6) 0;
  padding: var(--scale-size-8) var(--scale-size-12);
  height: var(--scale-size-32);
  border: 1px solid var(--color-border-primary-default);
  background: var(--color-background-primary-default);
  line-height: 1.1;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  border-radius: 4px;
  cursor: default;

  .mt-label__caption {
    @include mixins.truncate();

    display: inline-block;
    width: 100%;
  }

  &.mt-label--dismissable:hover {
    background-color: var(--color-background-brand-default);
    border-color: var(--color-border-brand-selected);

    .mt-label__caption {
      width: calc(100% - 15px);
    }

    .mt-label__dismiss {
      display: inline-block;
      color: var(--color-icon-brand-default);
      background: transparent;
      transform: translateY(1px);
    }
  }

  &.mt-label--size-medium {
    height: var(--scale-size-24);
    padding: var(--scale-size-4) var(--scale-size-12);
  }

  &.mt-label--size-small {
    height: var(--scale-size-16);
    padding: 0 var(--scale-size-8);
  }

  .mt-label__dismiss {
    display: none;
    position: absolute;
    height: 100%;
    right: var(--scale-size-10);
    top: 0;
    color: variables.$color-darkgray-200;
    background-color: variables.$color-gray-50;
    border: 0 none;
    cursor: pointer;
    outline: none;

    .mt-icon {
      width: var(--scale-size-12);
      height: var(--scale-size-12);
    }
  }

  &.mt-label--ghost {
    background: transparent;
    border-color: variables.$color-gray-300;
  }

  &.mt-label--appearance-badged {
    background: transparent;
    border: 0;
    font-size: var(--font-size-s);
    padding: var(--scale-size-4) 0;
    line-height: 22px;

    .mt-color-badge {
      margin: 0 var(--scale-size-8) var(--scale-size-6) 0;
    }
  }

  &.mt-label--appearance-pill {
    border-radius: 99999px;
  }

  &.mt-label--appearance-circle {
    width: var(--scale-size-24);
    height: var(--scale-size-24);
    border-radius: 100%;
    padding: var(--scale-size-4);
    border: 0;
    min-width: 24px;
  }

  &.mt-label--caps {
    text-transform: uppercase;
  }

  &.mt-label--info,
  &.mt-label--danger,
  &.mt-label--success,
  &.mt-label--warning,
  &.mt-label--neutral {
    &.mt-label--small {
      font-weight: 600;
      line-height: 14px;
      font-size: 12px;
      padding: 0 5px;
      padding-left: 15px;
      height: var(--scale-size-16);
    }

    &.mt-label--small::before {
      content: "";
      display: block;
      height: var(--scale-size-6);
      width: var(--scale-size-6);
      position: absolute;
      top: var(--scale-size-4);
      left: 5px;
    }
  }

  &.mt-label--info:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-shopware-brand-50,
      variables.$color-shopware-brand-500,
      variables.$color-shopware-brand-500,
      variables.$color-shopware-brand-100
    );
  }

  &.mt-label--success:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-emerald-50,
      variables.$color-emerald-500,
      variables.$color-emerald-500,
      variables.$color-emerald-100
    );
  }

  &.mt-label--danger:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-crimson-50,
      variables.$color-crimson-500,
      variables.$color-crimson-500,
      variables.$color-crimson-100
    );
  }

  &.mt-label--warning:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-pumpkin-spice-50,
      variables.$color-pumpkin-spice-500,
      variables.$color-pumpkin-spice-500,
      variables.$color-pumpkin-spice-100
    );
  }

  &.mt-label--neutral:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-gray-50,
      variables.$color-darkgray-200,
      variables.$color-gray-300,
      variables.$color-gray-100
    );
  }

  &.mt-label--primary:not(&--appearance-badged) {
    @include mt-label-variant(
      variables.$color-shopware-brand-500,
      variables.$color-shopware-brand-50,
      variables.$color-shopware-brand-500,
      variables.$color-shopware-brand-100
    );
  }
}
</style>
