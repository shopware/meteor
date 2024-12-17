<template>
  <input type="text" @focus="isOpen = true" :value="selectedItem" />

  <div v-if="isOpen" ref="listbox" role="listbox">
    <button role="listitem" @click="() => changeValue('1', 'Option 1')">Option 1</button>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";

withDefaults(
  defineProps<{
    valueProperty?: string;
  }>(),
  {
    valueProperty: "value",
  },
);

const isOpen = ref(false);

const listbox = useTemplateRef<HTMLElement>("listbox");
onClickOutside(listbox, () => {
  isOpen.value = false;
});

const model = defineModel();
const selectedItem = ref<string | null>(null);

function changeValue(value: string, label: string) {
  model.value = value;
  selectedItem.value = label;
}
</script>
