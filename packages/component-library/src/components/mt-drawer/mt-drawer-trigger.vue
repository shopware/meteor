<template>
  <DrawerTrigger :as="as">
    <slot />
  </DrawerTrigger>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { DrawerTrigger } from "reka-ui";
import { useDrawerContext } from "./composables/useDrawerContext";

/**
 * Opens the surrounding drawer. Renders a button unless `as` names another element or component.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
withDefaults(
  defineProps<{
    /** The element or component to render, for example `MtButton`. */
    as?: Component | string;
  }>(),
  {
    as: "button",
  },
);

useDrawerContext("mt-drawer-trigger");
</script>
