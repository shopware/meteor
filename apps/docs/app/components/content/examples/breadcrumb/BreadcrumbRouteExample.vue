<script setup lang="ts">
import { computed } from "vue";
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";

const route = useRoute();

const items = computed(() => {
  const segments = route.path.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll("-", " "),
    to: `/${segments.slice(0, index + 1).join("/")}`,
  }));
});
</script>

<template>
  <mt-breadcrumb :items="items" />
</template>
