<script setup lang="ts">
import { ref } from "vue";
import MtTextarea from "@shopware-ag/meteor-component-library/MtTextarea";

const value = ref("");
</script>

<template>
  <mt-textarea
    v-model="value"
    label="Description"
    placeholder="Describe the item"
    :error="{ detail: 'A description is required.' }"
  />
</template>
