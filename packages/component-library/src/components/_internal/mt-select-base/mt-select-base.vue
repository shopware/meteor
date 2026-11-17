<template>
  <mt-base-field
    :class="mtFieldClasses"
    v-bind="$attrs"
    :disabled="disabled"
    :has-focus="hasFocus"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <template #field-prefix>
      <slot name="mt-select-prefix" />
    </template>

    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #element="{ identification }">
      <div
        ref="selectWrapper"
        class="mt-select__selection"
        tabindex="0"
        @click="expand"
        @focusin="isFocusWithin = true"
        @focusout="isFocusWithin = false"
        @keydown="expandByKeyboard"
        @keypress="expandByTyping"
        @keydown.tab="collapse"
        @keydown.esc="collapse"
      >
        <slot name="mt-select-selection" v-bind="{ identification, disabled, expand, collapse }" />
      </div>

      <div class="mt-select__selection-indicators" :style="{ right: selectionIndicatorsRight }">
        <mt-loader
          v-if="isLoading"
          class="mt-select__select-indicator"
          size="16px"
          :backdrop="false"
        />

        <button
          v-if="!disabled && showClearableButton"
          class="mt-select__select-indicator-hitbox"
          data-clearable-button
          data-testid="select-clear-button"
          @click.prevent.stop="emitClear"
        >
          <mt-icon
            class="mt-select__select-indicator mt-select__select-indicator-clear"
            name="regular-times-s"
            size="var(--scale-size-10)"
            color="var(--color-icon-primary-default)"
          />
        </button>

        <mt-icon
          class="mt-select__select-indicator"
          data-testid="mt-select__select-indicator"
          :class="{ 'mt-select__select-indicator-rotated': expanded }"
          name="regular-chevron-down-s"
          size="var(--scale-size-10)"
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
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtLoader from "../../mt-loader/mt-loader.vue";
import MtFieldError from "../mt-field-error/mt-field-error.vue";

/**
 * Keys that open a focused, closed select, the same ones that open a native select.
 * Printable characters open it too, see `expandByTyping`.
 */
const OPENING_KEYS = ["ArrowDown", "ArrowUp", "Enter", " "];

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

    /**
     * Render the select field in small
     */
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
      isFocusWithin: false,
      suffixWidth: 0,
    };
  },

  computed: {
    hasFocus(): boolean {
      return this.expanded || this.isFocusWithin;
    },

    mtFieldClasses(): { "has--focus": boolean } {
      return { "has--focus": this.hasFocus };
    },

    selectionIndicatorsRight(): string {
      const baseRightPx = this.small ? 11 : 17;
      const rightPx = baseRightPx + (this.suffixWidth || 0);
      return `${rightPx}px`;
    },
  },

  mounted() {
    this.$nextTick(() => this.updateSuffixWidth());
    window.addEventListener("resize", this.updateSuffixWidth, { passive: true });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateSuffixWidth);
  },

  emits: [
    "select-expanded",
    "select-collapsed",
    "clear",
    "inheritance-restore",
    "inheritance-remove",
  ],

  methods: {
    updateSuffixWidth() {
      // Find the suffix container to get the width
      const suffixElement = this.$el?.querySelector(
        ".mt-block-field__block > .mt-field__addition:not(.is--prefix)",
      );

      if (!suffixElement) {
        this.suffixWidth = 0;
        return;
      }

      this.suffixWidth = suffixElement.offsetWidth;
    },

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

    /**
     * Opens the select from ArrowDown, ArrowUp, Enter or Space, like a native select.
     * Only keys on the select itself count, so buttons inside it keep their own keys.
     */
    expandByKeyboard(event: KeyboardEvent) {
      if (this.expanded || event.target !== this.$refs.selectWrapper) {
        return;
      }

      if (!OPENING_KEYS.includes(event.key) || event.ctrlKey || event.metaKey) {
        return;
      }

      // Keeps Space and the arrow keys from scrolling the page
      event.preventDefault();
      this.expand();
    },

    /**
     * Opens the select when a key types a character, so the character starts the search.
     * `keypress` fires only for keys that produce text, AltGr and Option characters included,
     * and never for shortcuts like CTRL+S.
     *
     * @example <div @keypress="expandByTyping">
     */
    expandByTyping(event: KeyboardEvent) {
      if (this.expanded || event.target !== this.$refs.selectWrapper) {
        return;
      }

      if (event.key.length === 1) {
        this.expand();
      }
    },

    collapse(event?: Event) {
      const wrapper = this.$refs.selectWrapper as HTMLElement | undefined;
      const hadFocus = wrapper?.contains(document.activeElement) ?? false;

      document.removeEventListener("click", this.listenToClickOutside);
      this.expanded = false;

      // @ts-expect-error - target is set and contains dataset
      // do not let clearable button trigger change event
      if (event?.target?.dataset.clearableButton === undefined) {
        this.$emit("select-collapsed");
      }

      // TAB and SHIFT+TAB then move on from the select itself, and ESC keeps the focus on it
      if (hadFocus) {
        wrapper?.focus();
      }
    },

    listenToClickOutside(event: Event) {
      // @ts-expect-error - path exists in event
      let { path } = event;
      if (typeof path === "undefined") {
        path = this.computePath(event);
      }

      // Check if path contains a "mt-popover-deprecated" or "mt-popover-deprecated__wrapper"
      if (
        path.find((element: any) => {
          const containsMtPopoverDeprecated = element.classList.contains("mt-popover-deprecated");
          const containsMtPopoverDeprecatedWrapper = element.classList.contains(
            "mt-popover-deprecated__wrapper",
          );

          return containsMtPopoverDeprecated || containsMtPopoverDeprecatedWrapper;
        })
      ) {
        return;
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

    /**
     * Moves the focus to the select itself, where the keyboard can open it again.
     *
     * @example this.$refs.selectBase.focus();
     */
    focus() {
      (this.$refs.selectWrapper as HTMLElement | undefined)?.focus();
    },

    emitClear() {
      this.$emit("clear");
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
  background-color: var(--color-background-primary-default);
  position: relative;
  overflow: hidden;
}

.mt-select .mt-select__selection {
  display: flex;
  align-items: center;
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
  gap: var(--scale-size-12);
  align-items: center;
  top: 50%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 0 solid transparent;
  color: var(--color-icon-primary-default);
  cursor: pointer;
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  border-radius: var(--border-radius-xs);

  &:hover,
  &:focus-visible {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
  }
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

.mt-select.mt-select--small .mt-select__selection {
  padding: 0 var(--scale-size-6);
}

.mt-select.is--disabled .mt-block-field__block,
.mt-select.is--disabled .mt-label,
.mt-select.is--disabled input {
  background-color: var(--color-background-tertiary-default);
}

.mt-select--small {
  cursor: pointer;
}

.mt-select.mt-select--small .mt-block-field__block {
  min-height: var(--scale-size-32);
}

/* Vue.js transitions */
.mt-select-result-list-fade-down-enter-active,
.mt-select-result-list-fade-down-leave-active {
  transition: all ease-in-out 0.2s;
  transform: translateY(0);
}

.mt-select-result-list-fade-down-enter-from,
.mt-select-result-list-fade-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
