<template>
  <component :is="as ?? 'button'" @click="() => setIsOpen(false)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { type Component } from "vue";
import { useModalContext } from "../composables/useModalContext";

defineProps<{
  as?: Component | string;
}>();

const { setIsOpen } = useModalContext("mt-modal-trigger");
</script>
