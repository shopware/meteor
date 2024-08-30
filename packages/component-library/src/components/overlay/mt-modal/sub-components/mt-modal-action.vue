<template>
  <component :is="as" @click="$emit('click', closeModal)"><slot /></component>
</template>

<script setup lang="ts">
import { type Component } from "vue";
import { useModalContext } from "../composables/useModalContext";

defineEmits(["click"]);

defineProps<{ as: Component | string }>();

const { setIsOpen } = useModalContext("mt-modal-trigger");

const closeModal = () => setIsOpen(false);
</script>
