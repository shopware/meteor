<template>
  <div class="example-row">
    <mt-button>Default</mt-button>
    <mt-button :disabled="true">Disabled</mt-button>
    <mt-button :is-loading="true">Loading</mt-button>
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
