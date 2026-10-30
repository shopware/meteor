<script setup lang="ts">
import { MtPage, MtPanel } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="height: 400px; resize: horizontal; overflow: hidden">
    <mt-page :breadcrumb="[{ label: 'Shopping Experiences', icon: 'image-text' }]">
      <template #start>
        <mt-panel label="Blocks">
          <placeholder-slot name="start" inset style="width: 10rem" />
        </mt-panel>
      </template>

      <placeholder-slot name="default" />

      <template #end>
        <mt-panel label="Properties">
          <placeholder-slot name="end" inset style="width: 12rem" />
        </mt-panel>
      </template>
    </mt-page>
  </div>
</template>
