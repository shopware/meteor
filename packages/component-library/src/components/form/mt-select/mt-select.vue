<template>
  <input type="text" @click="isOpen = true" />

  <div v-if="isOpen" role="listbox"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
</script>
