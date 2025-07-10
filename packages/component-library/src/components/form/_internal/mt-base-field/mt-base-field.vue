<template>
  <div
    class="mt-field"
    :class="[
      {
        'has--error': hasError,
        'is--disabled': disabled,
        'is--inherited': isInherited,
        'has--focus': hasFocus,
        'mt-field--future-remove-default-margin': future.removeDefaultMargin,
      },
      mtBlockSize,
    ]"
  >
    <div class="mt-field__label">
      <mt-inheritance-switch
        v-if="isInheritanceField"
        :disabled="disableInheritanceToggle"
        class="mt-field__inheritance-icon"
        :is-inherited="isInherited"
        v-bind="{ ...$attrs, class: '' }"
      />

      <label v-if="showLabel" :for="identification" :class="mtFieldLabelClasses">
        <slot name="label" />
      </label>

      <mt-help-text
        v-if="helpText"
        class="mt-field__help-text"
        :text="helpText"
        placement="right"
      />
    </div>

    <div class="mt-block-field__block">
      <div class="mt-field__addition is--prefix">
        <slot name="field-prefix" v-bind="{ disabled, identification }" />
      </div>

      <slot name="element" v-bind="{ disabled, identification }" />

      <div v-if="copyable" class="mt-field__addition">
        <mt-field-copyable
          :display-name="identification"
          :copyable-text="copyableText"
          :tooltip="copyableTooltip"
        />
      </div>

      <div v-else class="mt-field__addition">
        <slot name="field-suffix" v-bind="{ disabled, identification }" />
      </div>
    </div>

    <slot name="error" />

    <div class="mt-field__hint-wrapper">
      <div class="mt-field__hint">
        <slot name="field-hint" />
      </div>

      <div class="mt-field__hint-right">
        <slot name="field-hint-right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtInheritanceSwitch from "../mt-inheritance-switch/mt-inheritance-switch.vue";
import MtFieldCopyable from "../mt-field-copyable/mt-field-copyable.vue";
import MtHelpText from "../../mt-help-text/mt-help-text.vue";
import useEmptySlotCheck from "../../../../composables/useEmptySlotCheck";
import MtValidationMixin from "../../../../mixins/validation.mixin";
import MtFormFieldMixin from "../../../../mixins/form-field.mixin";
import { createId } from "../../../../utils/id";
import { useFutureFlags } from "@/composables/useFutureFlags";

export default defineComponent({
  name: "MtBaseField",

  components: {
    "mt-inheritance-switch": MtInheritanceSwitch,
    "mt-help-text": MtHelpText,
    "mt-field-copyable": MtFieldCopyable,
  },

  mixins: [MtFormFieldMixin, MtValidationMixin],

  props: {
    /**
     * Determines if the field is disabled.
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
     * Toggles the copy function of the text field.
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

    hasFocus: {
      type: Boolean,
      required: true,
    },

    /**
     * A text that helps the user to understand what this field does.
     */
    helpText: {
      type: String,
      required: false,
      default: "",
    },

    copyableText: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The size of the text field.
     *
     * @values small, default
     */
    size: {
      type: String,
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

  data(): { id: string | undefined } {
    return {
      id: undefined,
    };
  },

  mounted() {
    this.id = createId();
  },

  computed: {
    identification(): string {
      if (this.name) {
        return this.name;
      }

      return `mt-field--${this.id}`;
    },

    showLabel(): boolean {
      // @ts-expect-error - label exists on scopedSlots and if not we use optional chaining
      return !!this.$slots.label || !!this.$slots.label?.();
    },

    mtFieldLabelClasses(): { "is--required": boolean } {
      return {
        "is--required": this.required,
      };
    },

    mtBlockSize(): string {
      return `mt-field--${this.size}`;
    },

    hasError(): boolean {
      return this.hasSlotContent(this.$slots.error);
    },
  },

  setup() {
    const { hasSlotContent } = useEmptySlotCheck();
    const future = useFutureFlags();

    return {
      hasSlotContent,
      future,
    };
  },
});
</script>

<style lang="css">
.mt-field {
  width: 100%;
  margin-bottom: var(--scale-size-32);
}

.mt-field .mt-field__help-text {
  margin-left: var(--scale-size-4);
  align-self: center;
}

.mt-field.has--error {
  margin-bottom: var(--scale-size-12);
}

.mt-field.is--disabled {
  cursor: not-allowed;
}

.mt-field__hint-wrapper {
  display: flex;
  justify-content: space-between;
}

.mt-field__hint,
.mt-field__hint-right {
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-tertiary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-field__hint:empty,
.mt-field__hint-right:empty {
  display: none;
}

.mt-field__hint-right {
  justify-content: flex-end;
}

.mt-field input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fff inset;
}

.mt-field .mt-block-field__block {
  display: flex;
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
}

.mt-field input,
.mt-field select,
.mt-field textarea {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 13px var(--scale-size-16);
  border: none;
  background: var(--color-elevation-surface-raised);
  font-size: var(--font-size-xs);
  font-family: var(--font-size-body);
  line-height: 1;
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease;
  color: var(--color-text-primary-default);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.mt-field input:invalid,
.mt-field input:-moz-submit-invalid,
.mt-field input:-moz-ui-invalid,
.mt-field select:invalid,
.mt-field select:-moz-submit-invalid,
.mt-field select:-moz-ui-invalid,
.mt-field textarea:invalid,
.mt-field textarea:-moz-submit-invalid,
.mt-field textarea:-moz-ui-invalid {
  box-shadow: none;
}

.mt-field input:disabled,
.mt-field select:disabled,
.mt-field textarea:disabled {
  background: var(--color-background-primary-disabled);
  border-color: #d1d9e0;
  cursor: default !important;
}

.mt-field input::placeholder,
.mt-field select::placeholder,
.mt-field textarea::placeholder {
  color: var(--color-text-secondary-default);
}

.mt-field.has--focus .mt-block-field__block {
  border-color: var(--color-border-brand-selected);
  box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
}

.mt-field.has--error label {
  color: var(--color-text-critical-default);
}

.mt-field.has--error.mt-field input {
  background-color: var(--color-background-critical-dark);
}

.mt-field.has--error .mt-field__addition {
  border-left: 1px solid var(--color-border-critical-default);
}

.mt-field.has--error .mt-field__addition.is--prefix {
  border-right: 1px solid var(--color-border-critical-default);
  border-left: none;
}

.mt-field.has--error .mt-block-field__block {
  background: var(--color-background-critical-dark);
  border-color: var(--color-border-critical-default);
}

.mt-field.has--error.has--focus .mt-block-field__block {
  box-shadow: 0 0 4px lighten(#de294c, 30%);
}

.mt-field .mt-field--select__options .mt-icon {
  margin-bottom: 5px;
}

.mt-field.mt-field--small {
  margin-bottom: 0;
}

.mt-field.mt-field--small input,
.mt-field.mt-field--small textarea,
.mt-field.mt-field--small select {
  padding: var(--scale-size-4) var(--scale-size-16);
}

.mt-field .mt-field__addition {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  background: var(--color-interaction-secondary-dark);
  border-left: 1px solid var(--color-border-primary-default);
  border-right: none;
  padding: var(--scale-size-12) 15px;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-primary-default);
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease;
}

.mt-field .mt-field__addition:empty {
  display: none;
}

.mt-field .mt-field__addition:has(button) {
  padding: 0;

  & > button {
    width: 100%;
    height: 100%;
    padding: var(--scale-size-12) 15px;
  }
}

.mt-field .mt-field__addition.is--prefix {
  border-right: 1px solid var(--color-border-primary-default);
  border-left: none;
}

.mt-field .mt-field__addition.is--prefix:empty {
  display: none;
}

.mt-field.mt-field--small .mt-field__addition {
  padding: 5px var(--scale-size-16);
}

.mt-field .mt-field__inheritance-icon {
  margin-left: var(--scale-size-4);
  margin-right: var(--scale-size-4);
}

.mt-field .mt-field__button-restore {
  color: #52667a;
  padding: 0 var(--scale-size-8);
  border: none;
  background: none;
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.mt-field .mt-field__label {
  display: flex;
  line-height: 16px;
  font-size: 14px;
  margin-bottom: var(--scale-size-8);
  color: var(--color-text-primary-default);
}

.mt-field .mt-field__label label {
  flex-grow: 1;
}

.mt-field .mt-field__label:empty,
.mt-field .mt-field__label:has(label:only-child:empty) {
  display: none;
}

.mt-field .mt-field__label .is--required::after {
  content: "*";
  color: var(--color-icon-brand-default);
  margin-left: var(--scale-size-4);
}

.mt-field.is--inherited .mt-field__label {
  color: var(--color-text-accent-default);
}

.mt-field.is--inherited .mt-field__label .sw-icon {
  color: var(--color-icon-accent-default);
}

.mt-field--future-remove-default-margin {
  margin-bottom: 0;
}
</style>
