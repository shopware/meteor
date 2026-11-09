<script setup lang="ts">
import { MtApp } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-app style="--mt-app-height: 480px" :breakpoint="0">
    <template #navigation>
      <placeholder-slot name="navigation" style="width: 12rem" />
    </template>

    <placeholder-slot name="default" inset />

    <template #sidebar>
      <placeholder-slot name="sidebar" inset style="width: 12rem" />
    </template>
  </mt-app>
</template>
