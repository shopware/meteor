<script setup lang="ts">
import {
  MtApp,
  MtContentHeader,
  MtPage,
  MtPanel,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Customers", to: "/customers", icon: "users" },
  { label: "Anna Schmidt" },
];
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page :breadcrumb="breadcrumb">
      <template #actions>
        <placeholder-slot name="Page: actions" />
      </template>

      <template #start>
        <mt-panel label="Customers" resizable>
          <placeholder-slot name="Page: start" inset />
        </mt-panel>
      </template>

      <div class="stack">
        <mt-content-header title="Anna Schmidt">
          <template #actions>
            <placeholder-slot name="Content Header: actions" />
          </template>

          <placeholder-slot name="Content Header: default" />
        </mt-content-header>

        <placeholder-slot name="Page: default" style="height: 24rem" />
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
