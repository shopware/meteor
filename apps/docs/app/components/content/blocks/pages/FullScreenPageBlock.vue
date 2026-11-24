<script setup lang="ts">
import { MtApp, MtPage, MtPanel, type BreadcrumbItem } from "@shopware-ag/meteor-component-library";

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
    <mt-page :breadcrumb="breadcrumb" closable inset>
      <template #actions>
        <placeholder-slot name="Page: actions" />
      </template>

      <template #start>
        <mt-panel label="Layers" icon="regular-layer-group" closable resizable>
          <placeholder-slot name="Page: start" inset />
        </mt-panel>
      </template>

      <placeholder-slot name="Page: default" inset />

      <template #end>
        <mt-panel label="Properties" icon="regular-sliders-v" closable resizable>
          <placeholder-slot name="Page: end" inset />
        </mt-panel>
      </template>
    </mt-page>
  </mt-app>
</template>
