<template>
  <component :is="as" @click="() => setIsOpen(true)"><slot /></component>
</template>

<script setup lang="ts">
import { type Component } from "vue";
import { useModalContext } from "../composables/useModalContext";

defineProps<{ as: Component }>();

const { setIsOpen } = useModalContext("mt-modal-trigger");
</script>
