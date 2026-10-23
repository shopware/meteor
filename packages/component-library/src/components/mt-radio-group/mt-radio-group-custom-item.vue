<template>
  <div
    class="mt-radio-group-custom-item"
    :class="{
      'mt-radio-group-custom-item--disabled': isDisabled,
    }"
    @click="onClick"
  >
    <slot :disabled="isDisabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { RadioGroupContext } from "./_internal/mt-radio-group-context";

const props = withDefaults(
  defineProps<{
    value: string | number | boolean;
    /**
     * Disables this option. The option is also disabled when the whole group is disabled.
     * Pass the `disabled` slot prop on to the `MtRadioGroupIndicator` inside.
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

function onClick() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}
</script>
