<script setup lang="ts">
import MtBreadcrumb from "@shopware-ag/meteor-component-library/MtBreadcrumb";
import MtBreadcrumbItem from "@shopware-ag/meteor-component-library/MtBreadcrumbItem";
import MtBreadcrumbLink from "@shopware-ag/meteor-component-library/MtBreadcrumbLink";
import MtBreadcrumbSeparator from "@shopware-ag/meteor-component-library/MtBreadcrumbSeparator";
</script>

<template>
  <div
    style="
      width: 360px;
      max-width: 100%;
      resize: horizontal;
      overflow: hidden;
      padding: 8px;
      border: 1px dashed var(--color-border-primary-default);
    "
  >
    <mt-breadcrumb overflow="wrap">
      <mt-breadcrumb-link to="#">Home</mt-breadcrumb-link>
      <mt-breadcrumb-separator />
      <mt-breadcrumb-link to="#">Catalog</mt-breadcrumb-link>
      <mt-breadcrumb-separator />
      <mt-breadcrumb-link to="#">Clothing and accessories for every season</mt-breadcrumb-link>
      <mt-breadcrumb-separator />
      <mt-breadcrumb-link to="#">Shoes</mt-breadcrumb-link>
      <mt-breadcrumb-separator />
      <mt-breadcrumb-link to="#">Sneakers</mt-breadcrumb-link>
      <mt-breadcrumb-separator />
      <mt-breadcrumb-item current>Running shoes</mt-breadcrumb-item>
    </mt-breadcrumb>
  </div>
</template>
