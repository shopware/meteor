<template>
  <sw-base-field
    :class="swFieldClasses"
    v-bind="$attrs"
    :disabled="disabled"
    :has-focus="expanded"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
  >
    <template #label>
      {{ label }}
    </template>

    <template #field-prefix>
      <slot name="sw-select-prefix" />
    </template>

    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #element="{ identification, error, size }">
      <div
        ref="selectWrapper"
        class="sw-select__selection"
        tabindex="0"
        @click="expand"
        @focus="expand"
        @keydown.tab="collapse"
        @keydown.esc="collapse"
      >
        <slot
          name="sw-select-selection"
          v-bind="{ identification, error, disabled, size, expand, collapse }"
        />
        <div class="sw-select__selection-indicators">
          <sw-loader v-if="isLoading" class="sw-select__select-indicator" size="16px" />

          <button
            v-if="!disabled && showClearableButton"
            class="sw-select__select-indicator-hitbox"
            data-clearable-button
            data-testid="select-clear-button"
            @click.prevent.stop="emitClear"
            @keydown.tab.stop="focusParentSelect"
          >
            <sw-icon
              class="sw-select__select-indicator sw-select__select-indicator-clear"
              name="regular-times-xxs"
            />
          </button>

          <sw-icon class="sw-select__select-indicator" name="solid-chevron-down-xs" />
        </div>
      </div>

      <template v-if="expanded">
        <transition name="sw-select-result-list-fade-down">
          <slot name="results-list" v-bind="{ collapse }" />
        </transition>
      </template>
    </template>

    <template #field-suffix>
      <slot name="sw-select-suffix" />
    </template>

    <template #field-hint>
      <slot name="sw-select-hint" />
    </template>

    <template #error>
      <sw-field-error v-if="error" :error="error" />
    </template>
  </sw-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwBaseField from "../sw-base-field/sw-base-field.vue";
import SwIcon from "../../../icons-media/sw-icon/sw-icon.vue";
import SwLoader from "../../../feedback-indicator/sw-loader/sw-loader.vue";
import SwFieldError from "../../_internal/sw-field-error/sw-field-error.vue";

export default defineComponent({
  name: "SwSelectBase",

  components: {
    "sw-base-field": SwBaseField,
    "sw-icon": SwIcon,
    "sw-loader": SwLoader,
    "sw-field-error": SwFieldError,
  },

  inheritAttrs: false,

  props: {
    /**
     * The label for the select field itself.
     */
    label: {
      type: String,
      required: true,
    },

    /**
     * Toggles the loading state of the select field.
     */
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Disables or enables the select field.
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Toggles a button to clear all selections.
     */
    showClearableButton: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * An error in your business logic related to this field.
     *
     * @example {"code": 500, "detail": "Error while saving"}
     */
    error: {
      type: Object,
      required: false,
      default: null,
    },

    /**
     * Toggles the inheritance visualization.
     */
    isInherited: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines if the field is inheritable.
     */
    isInheritanceField: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines the active state of the inheritance toggle.
     */
    disableInheritanceToggle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
    };
  },

  computed: {
    swFieldClasses(): { "has--focus": boolean } {
      return { "has--focus": this.expanded };
    },
  },

  methods: {
    toggleExpand() {
      if (!this.expanded) {
        this.expand();
      } else {
        this.collapse();
      }
    },

    expand() {
      if (this.expanded) {
        return;
      }

      if (this.disabled) {
        return;
      }

      this.expanded = true;
      document.addEventListener("click", this.listenToClickOutside);
      this.$emit("select-expanded");
    },

    collapse(event?: Event) {
      document.removeEventListener("click", this.listenToClickOutside);
      this.expanded = false;

      // @ts-expect-error - target is set and contains dataset
      // do not let clearable button trigger change event
      if (event?.target?.dataset.clearableButton === undefined) {
        this.$emit("select-collapsed");
      }

      // @ts-expect-error - event is a click event
      // allow to step back through form via SHIFT+TAB
      if (event?.shiftKey) {
        event.preventDefault();
        this.focusPreviousFormElement();
      }
    },

    focusPreviousFormElement() {
      const focusableSelector =
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
      const myFocusable = this.$el.querySelector(focusableSelector);
      const keyboardFocusable = [
        ...document.querySelectorAll(focusableSelector),
        // @ts-expect-error - target is set and contains dataset
      ].filter((el) => !el.hasAttribute("disabled") && el.dataset.clearableButton === undefined);

      keyboardFocusable.forEach((element, index) => {
        if (index > 0 && element === myFocusable) {
          const kbFocusable = keyboardFocusable[index - 1];
          // @ts-expect-error - click exists on element
          kbFocusable.click();
          // @ts-expect-error - focus exists on element
          kbFocusable.focus();
        }
      });
    },

    listenToClickOutside(event: Event) {
      // @ts-expect-error - path exists in event
      let { path } = event;
      if (typeof path === "undefined") {
        path = this.computePath(event);
      }

      // @ts-expect-error - path contains elements
      if (!path.find((element) => element === this.$el)) {
        this.collapse();
      }
    },

    computePath(event: Event) {
      const path = [];
      let { target } = event;

      while (target) {
        path.push(target);
        // @ts-expect-error - parentElement exists on target
        target = target.parentElement;
      }

      return path;
    },

    emitClear() {
      this.$emit("clear");
    },

    focusParentSelect(event: KeyboardEvent) {
      if (event?.shiftKey) {
        // @ts-expect-error - ref selectWrapper is defined
        this.$refs.selectWrapper.click();
        event.preventDefault();
      }
    },
  },
});
</script>

<style lang="scss">
@import "../../../assets/scss/variables.scss";

$sw-select-focus-transition: all ease-in-out 0.2s;

.sw-select {
  position: relative;
  min-width: 100px;

  .sw-block-field__block {
    transition: $sw-select-focus-transition;
    background-color: $color-white;
    position: relative;
    overflow: visible;
  }

  .sw-select__selection {
    width: 100%;
    position: relative;
    padding: 0 8px;
    border: none;
    font-size: $font-size-small;
    font-family: $font-family-default;
    line-height: 22px;
    color: $color-darkgray-200;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .sw-select__selection-indicators {
    position: absolute;
    display: flex;
    gap: 8px;
    top: 50%;
    right: 16px;
    transform: translate(0, -50%);
    z-index: 1;
  }

  .sw-select__selection-indicators .sw-loader {
    width: 16px;
    height: 16px;
    margin: 0;
    left: -24px;
    top: -4px;

    .sw-loader__container {
      transform: none;
      left: 0;
      top: 0;
    }
  }

  .sw-select__select-indicator-hitbox {
    background-color: transparent;
    border: 0 solid transparent;
    color: $color-darkgray-200;
    padding: 0 4px;
    cursor: pointer;

    .sw-select__select-indicator {
      display: block;
    }

    &:focus {
      .sw-select__select-indicator-clear {
        opacity: 1;
        pointer-events: all;
        cursor: pointer;
      }
    }
  }

  .sw-select__select-indicator {
    flex-shrink: 0;
    cursor: pointer;
  }

  .sw-select__select-indicator-clear {
    transition: 0.1s opacity ease;
    opacity: 0;
    pointer-events: none;
  }

  &:hover .sw-select__select-indicator-clear,
  &.has--focus .sw-select__select-indicator-clear {
    opacity: 1;
    pointer-events: all;
    cursor: pointer;
  }

  &.sw-field--medium .sw-select__selection {
    padding: 4px 6px 0;
  }

  &.sw-field--small .sw-select__selection {
    padding: 4px 6px 0;
  }

  &.is--disabled {
    .sw-block-field__block {
      background-color: $color-gray-100;
    }

    .sw-label {
      background-color: $color-gray-100;
    }

    input {
      background-color: $color-gray-100;
    }
  }

  &--small {
    cursor: pointer;

    .sw-select-selection-list--single .sw-label {
      cursor: pointer;
      height: 18px;
      padding-top: 1px;
    }
  }
}

// Vue.js transitions
.sw-select-result-list-fade-down-enter-active,
.sw-select-result-list-fade-down-leave-active {
  transition: $sw-select-focus-transition;
  transform: translateY(0);
}

.sw-select-result-list-fade-down-enter,
.sw-select-result-list-fade-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
