<template>
  <div
    class="mt-text-field mt-field"
    :class="[
      `mt-field--${size}`,
      {
        'has--error': hasError,
        'is--disabled': disabled,
        'is--inherited': isInherited,
        'has--focus': hasFocus,
        'mt-field--future-remove-default-margin': future.removeDefaultMargin,
        'mt-field--future-consistent-label-line-height': future.consistentLabelLineHeight,
      },
    ]"
  >
    <mt-field-label
      v-if="label"
      class="mt-field__label"
      :for="inputId"
      :required="required"
      :has-error="hasError"
      :disabled="disableInheritanceToggle"
      :inheritance="inheritanceState"
      :style="labelStyle"
      @update:inheritance="onInheritanceUpdate"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text
      v-if="helpText"
      class="mt-field__help-text"
      :text="helpText"
      placement="right"
      :style="{ gridArea: 'help-text', alignSelf: 'center' }"
    />

    <div class="mt-text-field__block mt-block-field__block">
      <mt-field-addition v-if="$slots.prefix" type="prefix" :size="size" :has-error="hasError">
        <slot name="prefix" />
      </mt-field-addition>

      <input
        :id="inputId"
        class="mt-text-field__input"
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

      <mt-field-addition v-if="copyable" :size="size" :has-error="hasError">
        <mt-field-copyable
          :copyable-text="String(currentValue)"
          :copyable-tooltip="copyableTooltip"
        />
      </mt-field-addition>

      <mt-field-addition v-else-if="$slots.suffix" :size="size" :has-error="hasError">
        <slot name="suffix" />
      </mt-field-addition>
    </div>

    <mt-field-error v-if="error" :error="error" :style="{ gridArea: 'error' }" />

    <div v-if="showFieldHint || maxLength" class="mt-field__hint-wrapper">
      <div class="mt-field__hint">
        <mt-field-hint v-if="showFieldHint" :hide-icon="!!$slots.hint">
          <slot name="hint">{{ hint }}</slot>
        </mt-field-hint>
      </div>

      <div v-if="maxLength" class="mt-field__hint-right">
        {{ String(modelValue)?.length ?? 0 }}/{{ maxLength }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useId, type PropType, type CSSProperties } from "vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldAddition from "../_internal/mt-field-addition/mt-field-addition.vue";
import MtFieldCopyable from "../_internal/mt-field-copyable/mt-field-copyable.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

export default defineComponent({
  name: "MtTextField",

  components: {
    "mt-field-label": MtFieldLabel,
    "mt-field-addition": MtFieldAddition,
    "mt-field-copyable": MtFieldCopyable,
    "mt-field-error": MtFieldError,
    "mt-field-hint": MtFieldHint,
    "mt-help-text": MtHelpText,
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
     * Optional caption below the field. The `#hint` slot takes precedence when provided.
     */
    hint: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },

    /**
     * The size of the text field.
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

  emits: [
    "update:modelValue",
    "change",
    "focus",
    "blur",
    "inheritance-restore",
    "inheritance-remove",
  ],

  setup() {
    return {
      future: useFutureFlags(),
      id: useId(),
    };
  },

  data() {
    return {
      currentValue: this.modelValue,
      hasFocus: false,
    };
  },

  computed: {
    identification(): string {
      return this.name ?? `mt-field--${this.id}`;
    },

    inputId(): string {
      if (!this.idSuffix || this.idSuffix.length <= 0) {
        return this.identification;
      }

      return `${this.identification}-${this.idSuffix}`;
    },

    hasError(): boolean {
      return !!this.error;
    },

    inheritanceState(): "linked" | "unlinked" | "none" {
      if (!this.isInheritanceField) return "none";

      return this.isInherited ? "linked" : "unlinked";
    },

    labelStyle(): CSSProperties {
      return {
        gridArea: "label",
        marginBottom: "var(--scale-size-8)",
        lineHeight: this.future.consistentLabelLineHeight
          ? "var(--font-line-height-xs)"
          : "16px",
      };
    },

    showFieldHint(): boolean {
      return !!this.$slots.hint || (this.hint != null && String(this.hint).trim() !== "");
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
      this.$emit("change", (event.target as HTMLInputElement).value || "");
    },

    onInput(event: Event): void {
      this.$emit("update:modelValue", (event.target as HTMLInputElement).value);
    },

    onInheritanceUpdate(value: "linked" | "unlinked"): void {
      if (value === "unlinked") {
        this.$emit("inheritance-remove");
      } else {
        this.$emit("inheritance-restore");
      }
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

<style scoped>
.mt-text-field {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  width: 100%;
  margin-bottom: var(--scale-size-32);
}

.mt-text-field.has--error {
  margin-bottom: var(--scale-size-12);
}

.mt-text-field.mt-field--small,
.mt-text-field.mt-field--future-remove-default-margin {
  margin-bottom: 0;
}

.mt-text-field.is--disabled {
  cursor: not-allowed;
}

.mt-text-field__block {
  grid-area: input;
  display: flex;
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
}

.mt-text-field.mt-field--small .mt-text-field__block {
  min-height: var(--scale-size-32);
}

.mt-text-field.has--focus .mt-text-field__block {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-text-field.has--error .mt-text-field__block {
  background: var(--color-background-critical-default);
  border-color: var(--color-border-critical-default);
}

.mt-text-field__input {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 13px var(--scale-size-16);
  border: none;
  background: var(--color-background-primary-default);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  line-height: 1;
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease;
  color: var(--color-text-primary-default);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.mt-text-field.mt-field--small .mt-text-field__input {
  padding: var(--scale-size-4) var(--scale-size-16);
}

.mt-text-field__input::placeholder {
  color: var(--color-text-secondary-default);
}

.mt-text-field__input:disabled {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
  cursor: default;
}

.mt-text-field.has--error .mt-text-field__input {
  background-color: var(--color-background-critical-default);
}

.mt-text-field__input:is(:invalid, :-moz-submit-invalid, :-moz-ui-invalid) {
  box-shadow: none;
}

.mt-text-field__input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px var(--color-background-primary-default) inset;
  -webkit-text-fill-color: var(--color-text-primary-default);
}

.mt-field__hint-wrapper {
  grid-area: hint;
  display: flex;
  justify-content: space-between;
}

.mt-field__hint,
.mt-field__hint-right {
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
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
</style>
