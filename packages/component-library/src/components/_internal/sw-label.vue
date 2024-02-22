<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <span class="sw-label" :class="labelClasses" @click.stop="$emit('selected')">
    <sw-color-badge v-if="appearance === 'badged'" :variant="variant" :rounded="true" />

    <span class="sw-label__caption">
      <slot />
    </span>

    <button
      v-if="showDismissable"
      class="sw-label__dismiss"
      :title="$tc('sw-label.remove')"
      @click.prevent.stop="$emit('dismiss')"
    >
      <slot name="dismiss-icon">
        <sw-icon data-testid="dismiss-label" name="regular-times-xxs" />
      </slot>
    </button>
  </span>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import SwIcon from "../icons-media/sw-icon/sw-icon.vue";
import SwColorBadge from "../feedback-indicator/sw-color-badge/sw-color-badge.vue";

export default defineComponent({
  name: "SwLabel",

  i18n: {
    messages: {
      en: {
        "sw-label": {
          remove: "Remove",
        },
      },
      de: {
        "sw-label": {
          remove: "Entfernen",
        },
      },
    },
  },

  components: {
    "sw-icon": SwIcon,
    "sw-color-badge": SwColorBadge,
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
        `sw-label--appearance-${this.appearance}`,
        `sw-label--size-${this.size}`,
        {
          [`sw-label--${this.variant}`]: !!this.variant,
          "sw-label--dismissable": this.showDismissable,
          "sw-label--ghost": this.ghost,
          "sw-label--caps": this.caps,
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
@use "sass:math";
@import "../assets/scss/variables.scss";
@import "../assets/scss/mixins.scss";

@mixin sw-label-variant($color-background, $color-text, $color-border, $color-border-normal) {
  background-color: $color-background;
  border-color: $color-border-normal;
  color: $color-text;

  &.sw-label--small::before {
    background: $color-border;
  }

  .sw-label__dismiss {
    color: $color-text;

    .sw-icon {
      color: $color-text;
    }
  }

  &.sw-label--ghost {
    background: transparent;
    border-color: $color-border;
  }

  &.sw-label--dismissable:hover {
    border-color: $color-border;
  }
}

$sw-label-border-radius: math.div($border-radius-default, 2);
$sw-label-pill-border-radius: 50px;

.sw-label {
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
  border-radius: $sw-label-border-radius;
  color: $color-darkgray-200;
  cursor: default;

  .sw-label__caption {
    @include truncate();

    display: inline-block;
    width: 100%;
  }

  &.sw-label--dismissable:hover {
    border-color: $color-shopware-brand-500;

    .sw-label__caption {
      width: calc(100% - 15px);
    }

    .sw-label__dismiss {
      display: inline-block;
      color: $color-shopware-brand-500;
      background: transparent;
    }
  }

  &.sw-label--size-medium {
    height: 24px;
    padding: 4px 12px;
  }

  &.sw-label--size-small {
    height: 16px;
    padding: 0 8px;
  }

  .sw-label__dismiss {
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

    .sw-icon {
      width: 12px;
      height: 12px;
    }
  }

  &.sw-label--ghost {
    background: transparent;
    border-color: $color-gray-300;
  }

  &.sw-label--appearance-badged {
    background: transparent;
    border: 0;
    font-size: $font-size-small;
    padding: 4px 0;
    line-height: 22px;

    .sw-color-badge {
      margin: 0 8px 6px 0;
    }
  }

  &.sw-label--appearance-pill {
    border-radius: $sw-label-pill-border-radius;
  }

  &.sw-label--appearance-circle {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    padding: 4px;
    border: 0;
    min-width: 24px;
  }

  &.sw-label--caps {
    text-transform: uppercase;
  }

  &.sw-label--info,
  &.sw-label--danger,
  &.sw-label--success,
  &.sw-label--warning,
  &.sw-label--neutral {
    &.sw-label--small {
      font-weight: 600;
      line-height: 14px;
      font-size: 12px;
      padding: 0 5px;
      padding-left: 15px;
      height: 16px;
    }

    &.sw-label--small::before {
      content: "";
      display: block;
      height: 6px;
      width: 6px;
      position: absolute;
      top: 4px;
      left: 5px;
    }
  }

  &.sw-label--info:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-shopware-brand-50,
      $color-shopware-brand-500,
      $color-shopware-brand-500,
      $color-shopware-brand-100
    );
  }

  &.sw-label--success:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-emerald-50,
      $color-emerald-500,
      $color-emerald-500,
      $color-emerald-100
    );
  }

  &.sw-label--danger:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-crimson-50,
      $color-crimson-500,
      $color-crimson-500,
      $color-crimson-100
    );
  }

  &.sw-label--warning:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-pumpkin-spice-50,
      $color-pumpkin-spice-500,
      $color-pumpkin-spice-500,
      $color-pumpkin-spice-100
    );
  }

  &.sw-label--neutral:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-gray-50,
      $color-darkgray-200,
      $color-gray-300,
      $color-gray-100
    );
  }

  &.sw-label--primary:not(&--appearance-badged) {
    @include sw-label-variant(
      $color-shopware-brand-500,
      $color-shopware-brand-50,
      $color-shopware-brand-500,
      $color-shopware-brand-100
    );
  }
}
</style>
