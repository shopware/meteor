<script setup lang="ts">
import { MtBreadcrumb } from "@shopware-ag/meteor-component-library";

const items = [
  { label: "Home", to: "#", icon: "home" },
  { label: "Products", to: "#" },
  { label: "Shoes" },
];
</script>

<template>
  <mt-breadcrumb :items="items" />
</template>
