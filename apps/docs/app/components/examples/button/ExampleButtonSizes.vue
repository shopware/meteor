<template>
  <div class="example-row">
    <mt-button size="x-small">X-Small</mt-button>
    <mt-button size="small">Small</mt-button>
    <mt-button size="default">Default</mt-button>
    <mt-button size="large">Large</mt-button>
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
