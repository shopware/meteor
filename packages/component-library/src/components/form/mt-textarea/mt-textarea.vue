<template>
  <mt-base-field
    class="mt-field--textarea"
    v-bind="$attrs"
    :name="formFieldName"
    :has-focus="hasFocus"
    :required="required"
    :disabled="disabled"
    :help-text="helpText"
    :is-inheritance-field="isInheritanceField"
    :is-inherited="isInherited"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <!-- eslint-disable-next-line vue/no-template-shadow,vue/no-unused-vars -->
    <template #element="{ identification, helpText, error, disabled }">
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <textarea
        :id="identification"
        :name="identification"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="inputState"
        :maxlength="maxLength"
        @change.stop="onChange"
        @input.stop="onInput"
        @focus="setFocus"
        @blur="removeFocus"
      />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>

    <template v-if="maxLength" #field-hint-right>
      {{ modelValue?.length ?? 0 }}/{{ maxLength }}
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";

export default defineComponent({
  name: "MtTextarea",

  components: {
    "mt-base-field": MtBaseField,
    "mt-field-error": MtFieldError,
  },

  mixins: [MtFormFieldMixin],

  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * Inherited value from another SalesChannel.
     */
    inheritedValue: {
      type: String,
      required: false,
      default: null,
    },

    label: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      required: false,
      default: null,
    },

    helpText: {
      type: String,
      required: false,
      default: null,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    error: {
      type: Object,
      required: false,
      default: null,
    },

    /**
     * If set to a value a character counter will be displayed.
     */
    maxLength: {
      type: Number,
      required: false,
      default: undefined,
    },
  },

  data() {
    return {
      currentValue: this.modelValue,
      hasFocus: false,
    };
  },

  computed: {
    inputState(): string {
      if (this.isInherited) {
        return this.inheritedValue;
      }

      return this.currentValue || "";
    },

    isInheritanceField(): boolean {
      if (this.$attrs.isInheritanceField) {
        return true;
      }
      return this.inheritedValue !== null;
    },

    isInherited(): boolean {
      if (this.$attrs.isInherited) {
        return true;
      }

      return this.isInheritanceField && this.currentValue === null;
    },
  },

  watch: {
    modelValue() {
      this.currentValue = this.modelValue;
    },
  },

  methods: {
    onInput(event: Event) {
      // @ts-expect-error - target is defined
      this.$emit("update:modelValue", event.target.value);
    },

    onChange(event: Event) {
      // @ts-expect-error - target is defined
      this.$emit("change", event.target.value);
    },

    setFocus() {
      this.hasFocus = true;
    },
    removeFocus() {
      this.hasFocus = false;
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.mt-field--textarea {
  textarea {
    line-height: 22px;
    min-height: 125px;
    max-height: 300px;
    resize: vertical;
  }

  &.has--error {
    textarea {
      background: $color-crimson-50;
    }
  }
}
</style>
