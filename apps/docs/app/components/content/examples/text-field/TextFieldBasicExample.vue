<script setup lang="ts">
import { ref } from "vue";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";

const value = ref("");
</script>

<template>
  <mt-text-field v-model="value" label="Text field label" />
</template>
