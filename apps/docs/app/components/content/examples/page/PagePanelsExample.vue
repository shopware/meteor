<script setup lang="ts">
import { MtPage, MtPanel } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="height: 400px; resize: horizontal; overflow: hidden">
    <mt-page :breadcrumb="[{ label: 'Products', icon: 'products' }]">
      <template #start>
        <mt-panel label="Filters">
          <placeholder-slot name="start" inset />
        </mt-panel>
      </template>

      <placeholder-slot name="default" />

      <template #end>
        <mt-panel label="Details">
          <placeholder-slot name="end" inset />
        </mt-panel>
      </template>
    </mt-page>
  </div>
</template>
