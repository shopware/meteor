<template>
  <mt-base-field
    :class="mtFieldClasses"
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
      <slot name="mt-select-prefix" />
    </template>

    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #element="{ identification, error, size }">
      <div
        ref="selectWrapper"
        class="mt-select__selection"
        tabindex="0"
        @click="expand"
        @focus="expand"
        @keydown.tab="collapse"
        @keydown.esc="collapse"
      >
        <slot
          name="mt-select-selection"
          v-bind="{ identification, error, disabled, size, expand, collapse }"
        />
      </div>

      <div class="mt-select__selection-indicators">
        <mt-loader v-if="isLoading" class="mt-select__select-indicator" size="16px" />

        <button
          v-if="!disabled && showClearableButton"
          class="mt-select__select-indicator-hitbox"
          data-clearable-button
          data-testid="select-clear-button"
          @click.prevent.stop="emitClear"
          @keydown.tab.stop="focusParentSelect"
        >
          <mt-icon
            class="mt-select__select-indicator mt-select__select-indicator-clear"
            name="regular-times-xxs"
            color="var(--color-icon-primary-default)"
          />
        </button>

        <mt-icon
          class="mt-select__select-indicator"
          data-testid="mt-select__select-indicator"
          :class="{ 'mt-select__select-indicator-rotated': expanded }"
          name="solid-chevron-down-xxs"
          color="var(--color-icon-primary-default)"
          @click.stop="toggleExpand"
        />
      </div>

      <template v-if="expanded">
        <transition name="mt-select-result-list-fade-down">
          <slot name="results-list" v-bind="{ collapse }" />
        </transition>
      </template>
    </template>

    <template #field-suffix>
      <slot name="mt-select-suffix" />
    </template>

    <template #field-hint>
      <slot name="mt-select-hint" />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtBaseField from "../mt-base-field/mt-base-field.vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtLoader from "../../../feedback-indicator/mt-loader/mt-loader.vue";
import MtFieldError from "../../_internal/mt-field-error/mt-field-error.vue";

export default defineComponent({
  name: "MtSelectBase",

  components: {
    "mt-base-field": MtBaseField,
    "mt-icon": MtIcon,
    "mt-loader": MtLoader,
    "mt-field-error": MtFieldError,
  },

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
    mtFieldClasses(): { "has--focus": boolean } {
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

<style>
.mt-select {
  position: relative;
  min-width: 100px;
}

.mt-select .mt-block-field__block {
  transition: all ease-in-out 0.2s;
  background-color: var(--color-elevation-surface-raised);
  position: relative;
  overflow: hidden;
}

.mt-select .mt-select__selection {
  width: 100%;
  position: relative;
  padding: 0 var(--scale-size-8);
  border: none;
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
  font-family: var(--font-family-body);
  color: var(--color-icon-primary-default);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.mt-select .mt-select__selection-indicators {
  position: absolute;
  display: flex;
  gap: var(--scale-size-8);
  top: 50%;
  right: var(--scale-size-16);
  transform: translate(0, -50%);
  z-index: 1;
}

.mt-select .mt-select__selection-indicators .mt-loader {
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  margin: 0;
  left: -24px;
  top: -4px;
}

.mt-select .mt-select__selection-indicators .mt-loader .mt-loader__container {
  transform: none;
  left: 0;
  top: 0;
}

.mt-select .mt-select__select-indicator-hitbox {
  background-color: transparent;
  border: 0 solid transparent;
  color: var(--color-icon-primary-default);
  padding: 0 var(--scale-size-4);
  cursor: pointer;
}

.mt-select .mt-select__select-indicator-hitbox .mt-select__select-indicator {
  display: block;
}

.mt-select .mt-select__select-indicator-hitbox:focus .mt-select__select-indicator-clear {
  opacity: 1;
  pointer-events: all;
  cursor: pointer;
}

.mt-select .mt-select__select-indicator {
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.mt-select .mt-select__select-indicator-rotated {
  transform: rotate(180deg);
}

.mt-select .mt-select__select-indicator-clear {
  transition: 0.1s opacity ease;
  opacity: 0;
  pointer-events: none;
}

.mt-select:hover .mt-select__select-indicator-clear,
.mt-select.has--focus .mt-select__select-indicator-clear {
  opacity: 1;
  pointer-events: all;
  cursor: pointer;
}

.mt-select.mt-field--medium .mt-select__selection {
  padding: var(--scale-size-4) var(--scale-size-6) 0;
}

.mt-select.mt-field--small .mt-select__selection {
  padding: var(--scale-size-4) var(--scale-size-6) 0;
}

.mt-select.is--disabled .mt-block-field__block,
.mt-select.is--disabled .mt-label,
.mt-select.is--disabled input {
  background-color: var(--color-background-primary-disabled);
}

.mt-select--small {
  cursor: pointer;
}

.mt-select--small .mt-select-selection-list--single .mt-label {
  cursor: pointer;
  height: var(--scale-size-18);
  padding-top: 1px;
}

.mt-select--small .mt-block-field__block {
  min-height: unset;
}

/* Vue.js transitions */
.mt-select-result-list-fade-down-enter-active,
.mt-select-result-list-fade-down-leave-active {
  transition: all ease-in-out 0.2s;
  transform: translateY(0);
}

.mt-select-result-list-fade-down-enter,
.mt-select-result-list-fade-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
