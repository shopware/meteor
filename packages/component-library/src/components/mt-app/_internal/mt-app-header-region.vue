<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from "vue";
import { appTriggerRegionKey } from "./mt-app-context";

/** The shell's header, whose components show the triggers of the panels before the pages do. */
provide(appTriggerRegionKey, "header");
</script>
