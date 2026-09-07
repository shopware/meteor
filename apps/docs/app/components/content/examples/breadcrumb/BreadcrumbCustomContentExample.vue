<script setup lang="ts">
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const items = [
  { label: "Media", to: "#" },
  { label: "Product images", to: "#" },
  { label: "Summer campaign" },
];
</script>

<template>
  <mt-breadcrumb :items="items">
    <template #item="{ item, current }">
      {{ item.label }}
      <mt-text
        v-if="current"
        as="span"
        size="xs"
        color="color-text-tertiary-default"
      >
        (24 files)
      </mt-text>
    </template>
  </mt-breadcrumb>
</template>
