<script setup lang="ts">
import MtDivider from "@shopware-ag/meteor-component-library/MtDivider";
</script>

<template>
  <div
    style="
      display: flex;
      height: 48px;
      gap: var(--scale-size-16);
      align-items: center;
    "
  >
    <span>Products</span>
    <mt-divider orientation="vertical" />
    <span>Orders</span>
    <mt-divider orientation="vertical" />
    <span>Customers</span>
  </div>
</template>
