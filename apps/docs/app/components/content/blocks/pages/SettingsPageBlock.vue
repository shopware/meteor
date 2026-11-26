<script setup lang="ts">
import {
  MtApp,
  MtCard,
  MtContentHeader,
  MtPage,
  MtPanel,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Settings", to: "/settings", icon: "cog" },
  { label: "Basic information" },
];
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="s" :breadcrumb="breadcrumb">
      <template #actions>
        <placeholder-slot name="Page: actions" />
      </template>

      <template #start>
        <mt-panel label="Settings">
          <placeholder-slot name="Page: start" inset />
        </mt-panel>
      </template>

      <div class="stack">
        <mt-content-header title="Basic information" />

        <mt-card title="Shop">
          <placeholder-slot style="height: 12rem" />
        </mt-card>

        <mt-card title="Maintenance">
          <placeholder-slot style="height: 4rem" />
        </mt-card>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}
</style>
