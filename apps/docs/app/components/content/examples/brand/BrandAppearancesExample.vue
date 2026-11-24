<script setup lang="ts">
import { MtBrand } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div>
    <div class="surface">
      <mt-brand title="Shopware Payments" variant="payments" appearance="dark" />
    </div>

    <!-- The light appearance is made for dark backgrounds, shown here with the dark theme. -->
    <div class="surface" data-theme="dark">
      <mt-brand title="Shopware Payments" variant="payments" appearance="light" />
    </div>
  </div>
</template>

<style scoped>
.surface {
  padding: var(--scale-size-16);
  background-color: var(--color-elevation-surface-default);
}
</style>
