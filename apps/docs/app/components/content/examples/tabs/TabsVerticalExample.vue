<script setup lang="ts">
import MtTabs from "@shopware-ag/meteor-component-library/MtTabs";

const items = [
  { label: "Overview", name: "overview" },
  { label: "Orders", name: "orders" },
  { label: "Customers", name: "customers" },
  { label: "Settings", name: "settings" },
];
</script>

<template>
  <mt-tabs :items="items" default-item="orders" vertical />
</template>
