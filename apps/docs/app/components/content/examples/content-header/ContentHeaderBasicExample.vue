<script setup lang="ts">
import { MtContentHeader } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-content-header title="Running shoes">
    <template #actions>
      <placeholder-slot name="actions" />
    </template>

    <placeholder-slot name="default" />
  </mt-content-header>
</template>
