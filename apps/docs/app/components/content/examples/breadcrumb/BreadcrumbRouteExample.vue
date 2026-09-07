<script setup lang="ts">
import { computed } from "vue";
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";
import MtBreadcrumbItem from "@shopware-ag/meteor-component-library/MtBreadcrumbItem";
import MtBreadcrumbLink from "@shopware-ag/meteor-component-library/MtBreadcrumbLink";
import MtBreadcrumbSeparator from "@shopware-ag/meteor-component-library/MtBreadcrumbSeparator";

const route = useRoute();

const crumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll("-", " "),
    to: `/${segments.slice(0, index + 1).join("/")}`,
  }));
});
</script>

<template>
  <mt-breadcrumb>
    <template v-for="(crumb, index) in crumbs" :key="crumb.to">
      <mt-breadcrumb-item v-if="index === crumbs.length - 1" current>
        {{ crumb.label }}
      </mt-breadcrumb-item>
      <mt-breadcrumb-link v-else :to="crumb.to">{{ crumb.label }}</mt-breadcrumb-link>
      <mt-breadcrumb-separator v-if="index < crumbs.length - 1" />
    </template>
  </mt-breadcrumb>
</template>
