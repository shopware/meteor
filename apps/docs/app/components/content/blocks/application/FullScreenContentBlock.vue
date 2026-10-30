<script setup lang="ts">
import { MtApp, MtPage, type BreadcrumbItem } from "@shopware-ag/meteor-component-library";

// The shell as a full-screen route shows it. In your application, keep the shell with its
// navigation in the root component and hide its regions in the meta of the route:
// meta: { mtAppRegions: { header: false, navigation: false, sidebar: false, contentFrame: false } }
const breadcrumb: BreadcrumbItem[] = [
  { label: "Shopping Experiences", to: "/shopping-experiences", icon: "image-text" },
  { label: "Homepage" },
];
</script>

<template>
  <mt-app>
    <mt-page :breadcrumb="breadcrumb" closable>
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>
