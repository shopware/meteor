<template>
  <input type="text" @focus="isOpen = true" />

  <div v-if="isOpen" ref="listbox" role="listbox"></div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";

const isOpen = ref(false);

const listbox = useTemplateRef<HTMLElement>("listbox");
onClickOutside(listbox, () => {
  isOpen.value = false;
});
</script>
