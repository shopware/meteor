<script setup lang="ts">
import { ref } from "vue";
import MtUrlField from "@shopware-ag/meteor-component-library/MtUrlField";

const value = ref("");
</script>

<template>
  <mt-url-field v-model="value" label="Website" placeholder="https://example.com">
    <template #hint>Include the https:// prefix.</template>
  </mt-url-field>
</template>
