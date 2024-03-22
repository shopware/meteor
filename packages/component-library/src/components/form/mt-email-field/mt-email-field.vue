<template>
  <mt-base-field
    class="mt-field--email"
    v-bind="$attrs"
    :name="name"
    :has-focus="hasFocus"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="currentValue"
    :help-text="helpText"
    :size="size"
    :required="required"
    :disabled="disabled"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <template #field-prefix>
      <slot name="prefix" />
    </template>

    <template #element="{ identification, disabled }">
      <input
        :id="identification"
        ref="input"
        type="email"
        :name="identification"
        :disabled="disabled"
        :value="currentValue"
        :placeHolder="placeholder"
        @input.stop="onInput"
        @change.stop="onChange"
        @focus="setFocus"
        @blur="removeFocus"
      />
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="computedError" :error="computedError" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";

export default defineComponent({
  name: "MtEmailField",

  extends: MtTextField,

  data() {
    return {
      hasFocus: false,
      validationError: null,
    };
  },

  computed: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    computedError(): any {
      if (this.validationError) {
        return this.validationError;
      }

      return this.error;
    },
  },

  mounted() {
    if (!this.modelValue) {
      return;
    }

    this.checkValidity();
  },

  methods: {
    setFocus() {
      this.hasFocus = true;
    },

    removeFocus() {
      this.hasFocus = false;

      this.checkValidity();
    },

    checkValidity() {
      // @ts-expect-error - ref is available
      if (this.$refs.input.checkValidity()) {
        this.validationError = null;

        return;
      }

      // @ts-expect-error - validationError is defined in parent component
      this.validationError = {
        // @ts-expect-error - ref is available
        detail: this.$refs.input.validationMessage,
      };
    },
  },
});
</script>
