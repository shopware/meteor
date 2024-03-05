<template>
  <sw-popover class="sw-context-button" :title="title" :child-views="childViews">
    <template #trigger="{ toggleFloatingUi }">
      <slot name="button">
        <button
          role="button"
          aria-haspopup="menu"
          aria-label="Context menu"
          class="sw-context-button__button"
          @click="toggleFloatingUi"
          @keyup.enter="toggleFloatingUi"
        >
          <sw-icon :name="icon" small decorative />

          <slot name="button-text" />
        </button>
      </slot>
    </template>

    <template #popover-items__base="{ toggleFloatingUi, changeView }">
      <slot name="default" :change-view="changeView" :toggle-floating-ui="toggleFloatingUi" />
    </template>
  </sw-popover>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import type { View } from "../../overlay/sw-popover/sw-popover.interfaces";
import SwPopover from "../../overlay/sw-popover/sw-popover.vue";

export default defineComponent({
  name: "SwContextButtonVue",

  components: {
    "sw-icon": SwIcon,
    "sw-popover": SwPopover,
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
    contextClass() {
      return {
        "sw-context-button--disabled": this.disabled,
        "sw-context-button--error": this.hasError,
      };
    },
  },

  methods: {},
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-context-button-border-radius: $border-radius-default;

.sw-context-button {
  &.sw-context-button--disabled {
    .sw-context-button__button {
      color: var(--color-icon-primary-default);
      cursor: initial;

      &:hover {
        border: none;
      }
    }
  }

  &.sw-context-button--disabled.sw-popover--open {
    .sw-context-button__button {
      border: none;
    }
  }

  &.sw-popover--open .sw-context-button__button {
    border-color: var(--color-border-primary-default);
  }

  .sw-context-button__button {
    position: relative;
    color: var(--color-icon-primary-default);
    background: 0 none;
    border: 1px solid transparent;
    border-radius: $sw-context-button-border-radius;
    cursor: pointer;
    height: 24px;
    line-height: 20px;
    padding: 0 8px;
    outline: none;
    font-family: $font-family-default;

    &:hover {
      border-color: var(--color-border-primary-default);
    }
  }

  &.sw-context-button--error {
    .sw-context-button__button {
      color: var(--color-text-critical-default);

      .sw-icon {
        color: var(--color-icon-primary-default);
      }
    }
  }
}
</style>
