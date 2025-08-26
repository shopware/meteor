<template>
  <mt-base-field
    class="mt-text-field"
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="String(currentValue)"
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

    <template #field-prefix>
      <slot name="prefix" />
    </template>

    <template #element="{ identification }">
      <input
        :id="createInputId(identification)"
        type="text"
        :name="identification"
        :disabled="hasDisabledInput"
        :value="currentValue"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :aria-label="label"
        @input="onInput"
        @change.stop="onChange"
        @focus="handleFocus"
        @blur="removeFocusClass"
      />
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>

    <template v-if="maxLength" #field-hint-right>
      {{ String(modelValue)?.length ?? 0 }}/{{ maxLength }}
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";

export default defineComponent({
  name: "MtTextField",

  components: {
    "mt-field-error": MtFieldError,
    "mt-base-field": MtBaseField,
  },

  props: {
    /**
     * The value of the text field.
     */
    modelValue: {
      type: String as PropType<string | number>,
      required: false,
      default: "",
    },

    /**
     * A placeholder text being displayed if no value is set.
     */
    placeholder: {
      type: String,
      required: false,
      default: "",
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
      default: "default",
      validator(value: string) {
        return ["small", "default"].includes(value);
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
     * If set to a value a character counter will be displayed.
     */
    maxLength: {
      type: Number,
      required: false,
      default: undefined,
    },

    /**
     * @ignore
     */
    idSuffix: {
      type: String,
      required: false,
      default: "",
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
      currentValue: this.modelValue,
      hasFocus: false,
    };
  },

  computed: {
    hasError(): boolean {
      // @ts-expect-error - isValid gets called in the mixin
      return !this.isValid || !!this.error;
    },

    hasDisabledInput(): boolean {
      return this.disabled || this.isInherited;
    },
  },

  watch: {
    modelValue(value) {
      this.currentValue = value;
    },
  },

  methods: {
    onChange(event: Event): void {
      // @ts-expect-error - target is defined
      this.$emit("change", event.target.value || "");
    },

    onInput(event: Event): void {
      // @ts-expect-error - target is defined
      this.$emit("update:modelValue", event.target.value);
    },

    handleFocus(event: FocusEvent): void {
      this.setFocusClass(event);
    },

    restoreInheritance(): void {
      this.$emit("update:modelValue", null);
    },

    createInputId(identification: string): string {
      if (!this.idSuffix || this.idSuffix.length <= 0) {
        return identification;
      }

      return `${identification}-${this.idSuffix}`;
    },

    setFocusClass(event: FocusEvent): void {
      this.$emit("focus", event);
      this.hasFocus = true;
    },

    removeFocusClass(event: FocusEvent): void {
      this.$emit("blur", event);
      this.hasFocus = false;
    },
  },
});
</script>
