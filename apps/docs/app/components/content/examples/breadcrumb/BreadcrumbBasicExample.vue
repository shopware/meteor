<script setup lang="ts">
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";
import MtBreadcrumbItem from "@shopware-ag/meteor-component-library/MtBreadcrumbItem";
import MtBreadcrumbLink from "@shopware-ag/meteor-component-library/MtBreadcrumbLink";
import MtBreadcrumbSeparator from "@shopware-ag/meteor-component-library/MtBreadcrumbSeparator";
</script>

<template>
  <mt-breadcrumb>
    <mt-breadcrumb-link to="#">Home</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link to="#">Products</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
  </mt-breadcrumb>
</template>
