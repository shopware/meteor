<script setup lang="ts">
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";

const items = [
  { label: "Home", to: "#" },
  { label: "Clothing and accessories for every season of the year", to: "#" },
  { label: "Shoes" },
];
</script>

<template>
  <div
    style="
      width: 480px;
      max-width: 100%;
      resize: horizontal;
      overflow: hidden;
      padding: 8px;
      border: 1px dashed var(--color-border-primary-default);
    "
  >
    <mt-breadcrumb :items="items" />
  </div>
</template>
