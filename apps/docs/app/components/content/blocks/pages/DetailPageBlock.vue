<script setup lang="ts">
import {
  MtApp,
  MtContentHeader,
  MtContentLayout,
  MtPage,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Products", to: "/products", icon: "products" },
  { label: "Running shoe Aero" },
];
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" inset style="width: 15rem" />
    </template>

    <template #content>
      <mt-page width="l" :breadcrumb="breadcrumb">
        <template #actions>
          <placeholder-slot name="Page: actions" />
        </template>

        <div class="stack">
          <mt-content-header title="Running shoe Aero">
            <template #actions>
              <placeholder-slot name="Content Header: actions" />
            </template>

            <placeholder-slot name="Content Header: default" />
          </mt-content-header>

          <mt-content-layout>
            <placeholder-slot name="Content Layout: default" style="height: 24rem" />

            <template #end>
              <placeholder-slot name="Content Layout: end" style="height: 16rem" />
            </template>
          </mt-content-layout>
        </div>
      </mt-page>
    </template>
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
