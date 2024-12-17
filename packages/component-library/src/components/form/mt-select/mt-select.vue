<template>
  <input type="text" @focus="isOpen = true" :value="selectedItem" />

  <div v-if="isOpen" ref="listbox" role="listbox">
    <button
      v-for="option in options"
      :key="option.value"
      role="listitem"
      @click="() => changeValue(option.value, option.label)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    T extends {
      value: string;
      label: string;
    }
  "
>
import { ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";

withDefaults(
  defineProps<{
    valueProperty?: string;
    options: T[];
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
