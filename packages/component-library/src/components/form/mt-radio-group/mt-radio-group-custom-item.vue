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

const props = defineProps<{
  value: string | number | boolean;
}>();

const radioGroup = inject<{
  selectedValue: { value: string | number | boolean | null | undefined };
  selectOption: (value: string | number | boolean) => void;
  disabled: { value: boolean };
}>("radioGroupContext");

const radioGroupContext = radioGroup!;

const isDisabled = computed(() => radioGroupContext.disabled.value);

function onClick() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}
</script>
