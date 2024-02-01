<template>
  <sw-base-field
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="currentValue"
    :has-focus="hasFocus"
    :help-text="helpText"
    :name="name"
    :size="size"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <template
      #field-prefix
    >
      <slot name="prefix" />
    </template>

    <template #element="{identification}">
      <input
        :id="createInputId(identification)"
        type="text"
        :name="identification"
        :disabled="disabled"
        :value="currentValue"
        :placeholder="placeholder"
        @input="onInput"
        @change="onChange"
        @focus="setFocusClass"
        @blur="removeFocusClass"
        v-on="additionalListeners"
      >
    </template>

    <template
      #field-suffix
    >
      <slot name="suffix" />
    </template>

    <template #error>
      <sw-field-error
        v-if="error"
        :error="error"
      />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </sw-base-field>
</template>

<script lang="ts">
import Vue from 'vue';
import SwBaseField from "../_internal/sw-base-field/sw-base-field.vue";
import SwFieldError from "../_internal/sw-field-error/sw-field-error.vue";

export default Vue.extend({
  name: 'SwTextField',

  components: {
    'sw-field-error': SwFieldError,
    'sw-base-field': SwBaseField
  },

  inheritAttrs: false,

  props: {
    /**
     * The value of the text field.
     */
    value: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * A placeholder text being displayed if no value is set.
     */
    placeholder: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * A label for your text field. Usually used to guide the user what value this field controls.
     */
    label: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * A text that helps the user to understand what this field does.
     */
    helpText: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * The size of the text field.
     *
     * @values small, default
     */
    size: {
      type: String,
      required: false,
      default: 'default',
      validator(value: string) {
        return ['small', 'default'].includes(value);
      },
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
     * @ignore
     */
    idSuffix: {
      type: String,
      required: false,
      default: '',
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
      currentValue: this.value,
      hasFocus: false,
    };
  },

  computed: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    additionalListeners(): Record<string, (Function | Function[])> {

      const additionalListeners = { ...this.$listeners };

      delete additionalListeners.input;
      delete additionalListeners.change;

      return additionalListeners;
    },

    hasError(): boolean {
      // @ts-expect-error - isValid gets called in the mixin
      return !this.isValid || !!this.error;
    },
  },

  watch: {
    value(value) {
      this.currentValue = value;
    },
  },

  methods: {
    onChange(event: Event): void {
      // @ts-expect-error - target is defined
      this.$emit('change', event.target.value || '');
    },

    onInput(event: Event): void {
      // @ts-expect-error - target is defined
      this.$emit('input', event.target.value);
    },

    restoreInheritance(): void {
      this.$emit('input', null);
    },

    createInputId(identification: string): string {
      if (!this.idSuffix || this.idSuffix.length <= 0) {
        return identification;
      }

      return `${identification}-${this.idSuffix}`;
    },

    setFocusClass(): void {
      this.hasFocus = true;
    },

    removeFocusClass(): void {
      this.hasFocus = false;
    },
  },
});
</script>
