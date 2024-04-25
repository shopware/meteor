<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <span class="mt-label" :class="labelClasses" @click.stop="$emit('selected')">
    <mt-color-badge v-if="appearance === 'badged'" :variant="variant" :rounded="true" />

    <span class="mt-label__caption">
      <slot />
    </span>

    <button
      v-if="showDismissable"
      class="mt-label__dismiss"
      :title="$tc('mt-label.remove')"
      @click.prevent.stop="$emit('dismiss')"
    >
      <slot name="dismiss-icon">
        <mt-icon data-testid="dismiss-label" name="regular-times-xxs" />
      </slot>
    </button>
  </span>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import MtIcon from "../icons-media/mt-icon/mt-icon.vue";
import MtColorBadge from "../feedback-indicator/mt-color-badge/mt-color-badge.vue";

export default defineComponent({
  name: "MtLabel",

  i18n: {
    messages: {
      en: {
        "mt-label": {
          remove: "Remove",
        },
      },
      de: {
        "mt-label": {
          remove: "Entfernen",
        },
      },
    },
  },

  components: {
    "mt-icon": MtIcon,
    "mt-color-badge": MtColorBadge,
  },

  props: {
    variant: {
      type: String as PropType<"info" | "danger" | "success" | "warning" | "neutral" | "primary">,
      required: false,
      default: "",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["info", "danger", "success", "warning", "neutral", "primary"].includes(value);
      },
    },
    size: {
      type: String as PropType<"small" | "medium" | "default">,
      required: false,
      default: "default",
      validator(value: string) {
        return ["small", "medium", "default"].includes(value);
      },
    },
    appearance: {
      type: String as PropType<"default" | "pill" | "circle" | "badged">,
      required: false,
      default: "default",
      validator(value: string) {
        return ["default", "pill", "circle", "badged"].includes(value);
      },
    },
    ghost: {
      type: Boolean,
      required: false,
      default: false,
    },
    caps: {
      type: Boolean,
      required: false,
      default: false,
    },
    dismissable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  computed: {
    labelClasses() {
      return [
        `mt-label--appearance-${this.appearance}`,
        `mt-label--size-${this.size}`,
        {
          [`mt-label--${this.variant}`]: !!this.variant,
          "mt-label--dismissable": this.showDismissable,
          "mt-label--ghost": this.ghost,
          "mt-label--caps": this.caps,
        },
      ];
    },
    showDismissable(): boolean {
      return !!this.$attrs.onDismiss && this.dismissable;
    },
  },
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

$mt-label-border-radius: math.div($border-radius-default, 2);
$mt-label-pill-border-radius: 50px;

.mt-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
  min-width: 56px;
  margin: 0 6px 6px 0;
  padding: 8px 12px;
  line-height: 14px;
  font-size: $font-size-extra-small;
  height: 32px;
  border: 1px solid $color-gray-300;
  background: $color-gray-50;
  border-radius: $mt-label-border-radius;
  color: $color-darkgray-200;
  cursor: default;

  .mt-label__caption {
    @include truncate();

    display: inline-block;
    width: 100%;
  }

  &.mt-label--dismissable:hover {
    border-color: $color-shopware-brand-500;

    .mt-label__caption {
      width: calc(100% - 15px);
    }

    .mt-label__dismiss {
      display: inline-block;
      color: $color-shopware-brand-500;
      background: transparent;
    }
  }

  &.mt-label--size-medium {
    height: 24px;
    padding: 4px 12px;
  }

  &.mt-label--size-small {
    height: 16px;
    padding: 0 8px;
  }

  .mt-label__dismiss {
    display: none;
    position: absolute;
    height: 100%;
    right: 10px;
    top: 0;
    color: $color-darkgray-200;
    background-color: $color-gray-50;
    border: 0 none;
    cursor: pointer;
    outline: none;

    .mt-icon {
      width: 12px;
      height: 12px;
    }
  }

  &.mt-label--ghost {
    background: transparent;
    border-color: $color-gray-300;
  }

  &.mt-label--appearance-badged {
    background: transparent;
    border: 0;
    font-size: $font-size-small;
    padding: 4px 0;
    line-height: 22px;

    .mt-color-badge {
      margin: 0 8px 6px 0;
    }
  }

  &.mt-label--appearance-pill {
    border-radius: $mt-label-pill-border-radius;
  }

  &.mt-label--appearance-circle {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    padding: 4px;
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
      height: 16px;
    }

    &.mt-label--small::before {
      content: "";
      display: block;
      height: 6px;
      width: 6px;
      position: absolute;
      top: 4px;
      left: 5px;
    }
  }

  &.mt-label--info:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-shopware-brand-50,
      $color-shopware-brand-500,
      $color-shopware-brand-500,
      $color-shopware-brand-100
    );
  }

  &.mt-label--success:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-emerald-50,
      $color-emerald-500,
      $color-emerald-500,
      $color-emerald-100
    );
  }

  &.mt-label--danger:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-crimson-50,
      $color-crimson-500,
      $color-crimson-500,
      $color-crimson-100
    );
  }

  &.mt-label--warning:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-pumpkin-spice-50,
      $color-pumpkin-spice-500,
      $color-pumpkin-spice-500,
      $color-pumpkin-spice-100
    );
  }

  &.mt-label--neutral:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-gray-50,
      $color-darkgray-200,
      $color-gray-300,
      $color-gray-100
    );
  }

  &.mt-label--primary:not(&--appearance-badged) {
    @include mt-label-variant(
      $color-shopware-brand-500,
      $color-shopware-brand-50,
      $color-shopware-brand-500,
      $color-shopware-brand-100
    );
  }
}
</style>
