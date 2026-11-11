<template>
  <div
    class="mt-radio-group-custom-item"
    :class="{
      'mt-radio-group-custom-item--disabled': isDisabled,
    }"
    @click="onClick"
    @change="onChange"
  >
    <slot :disabled="isDisabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, shallowRef } from "vue";
import {
  radioGroupCustomItemKey,
  type RadioGroupContext,
} from "./_internal/mt-radio-group-context";

const props = withDefaults(
  defineProps<{
    value: string | number | boolean;
    /**
     * Disables this option, including the `MtRadioGroupIndicator` inside it. The option is also
     * disabled when the whole group is disabled.
     */
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const radioGroup = inject<RadioGroupContext>("radioGroupContext");

if (!radioGroup) {
  throw new Error("MtRadioGroupCustomItem must be used within MtRadioGroupRoot");
}

const radioGroupContext = radioGroup;

const isDisabled = computed(() => radioGroupContext.disabled.value || props.disabled);

const input = shallowRef<HTMLInputElement | null>(null);

provide(radioGroupCustomItemKey, {
  disabled: isDisabled,
  registerInput: (element) => {
    input.value = element;
  },
});

function select() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}

function onClick(event: MouseEvent) {
  // Links, buttons, form controls and the labels of form controls handle their own clicks.
  const control = (event.target as Element).closest("a, button, input, label, select, textarea");
  const handlesItsOwnClick =
    control !== null &&
    (event.currentTarget as Element).contains(control) &&
    !(control instanceof HTMLLabelElement && control.control === null);

  if (handlesItsOwnClick) {
    return;
  }

  // Any other click goes through the radio input, which selects the option on `change`.
  if (input.value) {
    input.value.click();
  } else {
    select();
  }
}

function onChange(event: Event) {
  if (input.value && event.target !== input.value) {
    return;
  }

  select();
}
</script>
