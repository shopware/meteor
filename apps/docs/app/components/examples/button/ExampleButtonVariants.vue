<template>
  <div class="example-row">
    <mt-button variant="primary">Primary</mt-button>
    <mt-button variant="secondary">Secondary</mt-button>
    <mt-button variant="tertiary">Tertiary</mt-button>
    <mt-button variant="critical">Critical</mt-button>
  </div>
</template>

<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
</script>

<style scoped>
.example-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
</style>
