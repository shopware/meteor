<script setup lang="ts">
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";

const items = [
  { label: "Home", to: "#" },
  { label: "Products", to: "#" },
  { label: "Shoes" },
];
</script>

<template>
  <mt-breadcrumb :items="items" />
</template>
