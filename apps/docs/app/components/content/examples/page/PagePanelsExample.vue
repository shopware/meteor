<script setup lang="ts">
import { MtPage } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="height: 400px; resize: horizontal; overflow: hidden">
    <mt-page
      :breadcrumb="[{ label: 'Shopping Experiences', icon: 'image-text' }]"
      start-label="Blocks"
      end-label="Properties"
    >
      <template #start>
        <placeholder-slot name="start" inset style="width: 10rem" />
      </template>

      <placeholder-slot name="default" />

      <template #end>
        <placeholder-slot name="end" inset style="width: 12rem" />
      </template>
    </mt-page>
  </div>
</template>
