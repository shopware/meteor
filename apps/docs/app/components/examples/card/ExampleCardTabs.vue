<template>
  <mt-card title="Customer details" subtitle="Account overview">
    <template #tabs>
      <mt-tabs default-item="overview" :items="tabItems" />
    </template>

    <p>
      Use tabs to switch between closely related views that still belong to the
      same section.
    </p>
  </mt-card>
</template>

<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtTabs from "@shopware-ag/meteor-component-library/MtTabs";

const tabItems = [
  { label: "Overview", name: "overview" },
  { label: "History", name: "history" },
];
</script>
