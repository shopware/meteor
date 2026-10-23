<script setup lang="ts">
import { MtPage } from "@shopware-ag/meteor-component-library";

const breadcrumb = [
  { label: "Products", to: "#", icon: "products" },
  { label: "Running shoes" },
];
</script>

<template>
  <div style="height: 320px">
    <mt-page :breadcrumb="breadcrumb">
      <template #actions>
        <placeholder-slot name="actions" />
      </template>

      <placeholder-slot name="default" />
    </mt-page>
  </div>
</template>
