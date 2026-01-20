<template>
  <div
    class="mt-radio-group-custom-item"
    :class="{
      'mt-radio-group-custom-item--disabled': isDisabled,
    }"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { RadioGroupContext } from "./_internal/mt-radio-group-context";

const props = defineProps<{
  value: string | number | boolean;
}>();

const radioGroup = inject<RadioGroupContext>("radioGroupContext");

if (!radioGroup) {
  throw new Error("MtRadioGroupCustomItem must be used within MtRadioGroupRoot");
}

const radioGroupContext = radioGroup;

const isDisabled = computed(() => radioGroupContext.disabled.value);

function onClick() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}
</script>
