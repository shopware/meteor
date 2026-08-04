<script setup lang="ts">
import { ref } from "vue";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";

const value = ref("");
</script>

<template>
  <mt-text-field
    v-model="value"
    label="Label"
    placeholder="Enter a value"
    :error="{ detail: 'This field is required.' }"
  />
</template>
