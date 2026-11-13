<template>
  <div
    :class="[
      'mt-select',
      `mt-select--${size}`,
      {
        'mt-select--focus': expanded,
        'mt-select--error': !!error,
        'mt-select--disabled': disabled,
        'mt-select--inherited': isInherited,
      },
    ]"
  >
    <mt-field-label
      v-if="label"
      class="mt-select__label"
      :for="identification"
      :required="required"
      :has-error="!!error"
      :disabled="disableInheritanceToggle"
      :inheritance="inheritanceState"
      :style="labelStyle"
      @update:inheritance="onInheritanceUpdate"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text
      v-if="helpText"
      class="mt-select__help-text"
      :text="helpText"
      placement="right"
      :style="{ gridArea: 'help-text' }"
    />

    <div class="mt-select__block">
      <mt-field-affix type="prefix" class="mt-select__prefix" :has-error="!!error">
        <slot name="mt-select-prefix" />
      </mt-field-affix>

      <div
        ref="selectWrapper"
        class="mt-select__selection"
        tabindex="0"
        @click="expand"
        @focus="expand"
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
          @keydown.tab.stop="focusParentSelect"
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

      <mt-field-affix v-if="copyable" class="mt-select__suffix" :has-error="!!error">
        <mt-field-copyable :copyable-text="copyableText" :tooltip="copyableTooltip" />
      </mt-field-affix>

      <mt-field-affix v-else class="mt-select__suffix" :has-error="!!error">
        <slot name="mt-select-suffix" />
      </mt-field-affix>
    </div>

    <mt-field-error v-if="error" :error="error" :style="{ gridArea: 'error' }" />

    <div class="mt-select__hint-row">
      <div class="mt-select__hint">
        <slot name="mt-select-hint" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type CSSProperties, type PropType } from "vue";
import { createId } from "../../../utils/id";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtLoader from "../../mt-loader/mt-loader.vue";
import MtFieldError from "../mt-field-error/mt-field-error.vue";
import MtFieldLabel from "../mt-field-label/mt-field-label.vue";
import MtFieldAffix from "../mt-field-affix/mt-field-affix.vue";
import MtFieldCopyable from "../mt-field-copyable/mt-field-copyable.vue";
import MtHelpText from "../../mt-help-text/mt-help-text.vue";

export default defineComponent({
  name: "MtSelectBase",

  components: {
    "mt-icon": MtIcon,
    "mt-loader": MtLoader,
    "mt-field-error": MtFieldError,
    "mt-field-label": MtFieldLabel,
    "mt-field-affix": MtFieldAffix,
    "mt-field-copyable": MtFieldCopyable,
    "mt-help-text": MtHelpText,
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
     * Determines if the field is required.
     */
    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * A text that helps the user to understand what this field does.
     */
    helpText: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * Toggles the copy function of the select field.
     */
    copyable: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * If set to true the tooltip will change on successful copy.
     */
    copyableTooltip: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * The text that gets copied to the clipboard.
     */
    copyableText: {
      type: String,
      required: false,
      default: "",
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
     * Render the select field in small without a search input
     */
    small: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * The size of the select field.
     *
     * @values small, default
     */
    size: {
      type: String as PropType<"small" | "default">,
      required: false,
      default: "default",
      validator(value: string) {
        return ["small", "default"].includes(value);
      },
    },

    /**
     * @ignore
     */
    name: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      expanded: false,
      suffixWidth: 0,
      id: undefined as string | undefined,
    };
  },

  computed: {
    identification(): string {
      return this.name ?? `mt-field--${this.id}`;
    },

    inheritanceState(): "linked" | "unlinked" | "none" {
      if (!this.isInheritanceField) return "none";

      return this.isInherited ? "linked" : "unlinked";
    },

    labelStyle(): CSSProperties {
      return {
        gridArea: "label",
        marginBottom: "var(--scale-size-8)",
        lineHeight: "var(--font-line-height-xs)",
      };
    },

    selectionIndicatorsRight(): string {
      const baseRightPx = this.small ? 11 : 17;
      const rightPx = baseRightPx + (this.suffixWidth || 0);
      return `${rightPx}px`;
    },
  },

  mounted() {
    this.id = createId();

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
      const suffixElement = this.$el?.querySelector(".mt-select__block > .mt-select__suffix");

      if (!suffixElement) {
        this.suffixWidth = 0;
        return;
      }

      this.suffixWidth = suffixElement.offsetWidth;
    },

    onInheritanceUpdate(value: "linked" | "unlinked") {
      if (value === "unlinked") {
        this.$emit("inheritance-remove");
      } else {
        this.$emit("inheritance-restore");
      }
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

<style scoped>
.mt-select {
  position: relative;
  min-width: 100px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  width: 100%;
}

.mt-select--disabled {
  cursor: not-allowed;
}

.mt-select .mt-select__block {
  grid-area: input;
  display: flex;
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background-color: var(--color-background-primary-default);
  position: relative;
  overflow: hidden;
}

.mt-select--small .mt-select__block {
  min-height: var(--scale-size-32);
}

.mt-select--focus .mt-select__block {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-select--error .mt-select__block {
  background-color: var(--color-background-critical-default);
  border-color: var(--color-border-critical-default);
}

.mt-select .mt-select__hint-row {
  grid-area: hint;
  display: flex;
  justify-content: space-between;
}

.mt-select .mt-select__hint {
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-select .mt-select__hint:empty,
.mt-select .mt-select__hint-row:has(> .mt-select__hint:empty) {
  display: none;
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

.mt-select .mt-select__selection-indicators .mt-loader :deep(.mt-loader__container) {
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
.mt-select--focus .mt-select__select-indicator-clear {
  opacity: 1;
  pointer-events: all;
  cursor: pointer;
}

.mt-select--small .mt-select__selection {
  padding: 0 var(--scale-size-6);
}

.mt-select--disabled .mt-select__block {
  background-color: var(--color-background-tertiary-default);
}

.mt-select--small {
  cursor: pointer;
}

.mt-select--small .mt-select__block {
  min-height: unset;
}
</style>
