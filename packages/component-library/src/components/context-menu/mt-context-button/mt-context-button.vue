<template>
  <mt-popover class="mt-context-button" :title="title" :child-views="childViews">
    <template #trigger="{ toggleFloatingUi }">
      <slot name="button">
        <button
          role="button"
          aria-haspopup="menu"
          aria-label="Context menu"
          class="mt-context-button__button"
          @click="toggleFloatingUi"
          @keyup.enter="toggleFloatingUi"
        >
          <mt-icon :name="icon" small decorative />

          <slot name="button-text" />
        </button>
      </slot>
    </template>

    <template #popover-items__base="{ toggleFloatingUi, changeView }">
      <slot name="default" :change-view="changeView" :toggle-floating-ui="toggleFloatingUi" />
    </template>
  </mt-popover>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import type { View } from "../../overlay/mt-popover/mt-popover.interfaces";
import MtPopover from "../../overlay/mt-popover/mt-popover.vue";

export default defineComponent({
  name: "MtContextButtonVue",

  components: {
    "mt-icon": MtIcon,
    "mt-popover": MtPopover,
  },

  props: {
    menuWidth: {
      type: Number,
      required: false,
      default: 220,
    },

    menuHorizontalAlign: {
      type: String as PropType<"right" | "left">,
      required: false,
      default: "right",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["right", "left"].includes(value);
      },
    },

    menuVerticalAlign: {
      type: String,
      required: false,
      default: "bottom",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["bottom", "top"].includes(value);
      },
    },

    icon: {
      type: String,
      required: false,
      default: "solid-ellipsis-h-s",
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    hasError: {
      type: Boolean,
      required: false,
      default: false,
    },

    autoClose: {
      type: Boolean,
      required: false,
      default: true,
    },

    title: {
      type: String,
      required: false,
      default: "",
    },

    childViews: {
      type: Array as PropType<View[]>,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {};
  },

  computed: {
    contextClass(): {
      "is--disabled": boolean;
      "has--error": boolean;
    } {
      return {
        "is--disabled": this.disabled,
        "has--error": this.hasError,
      };
    },
  },

  methods: {},
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$mt-context-button-color-text: $color-darkgray-200;
$mt-context-button-border-radius: $border-radius-default;
$mt-context-button-color-border: $color-gray-300;
$mt-context-button-color-disabled: $color-gray-100;

.mt-context-button {
  &.is--disabled {
    .mt-context-button__button {
      color: lighten($mt-context-button-color-text, 20%);
      cursor: initial;

      &:hover {
        border: none;
      }
    }
  }

  &.is--disabled.is--open {
    .mt-context-button__button {
      border: none;
    }
  }

  &.is--open .mt-context-button__button {
    border-color: $mt-context-button-color-border;
  }

  .mt-context-button__button {
    position: relative;
    color: $mt-context-button-color-text;
    background: 0 none;
    border: 1px solid transparent;
    border-radius: $mt-context-button-border-radius;
    cursor: pointer;
    height: 24px;
    line-height: 20px;
    padding: 0 8px;
    outline: none;
    font-family: $font-family-default;

    &:hover {
      border-color: $mt-context-button-color-border;
    }
  }

  &.has--error {
    .mt-context-button__button {
      .mt-icon {
        color: $mt-context-button-color-text;
      }

      color: $color-crimson-300;
    }
  }
}
</style>
