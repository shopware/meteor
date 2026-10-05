<template>
  <DrawerClose :as="as">
    <slot />
  </DrawerClose>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { DrawerClose } from "reka-ui";
import { useDrawerContext } from "./composables/useDrawerContext";

/**
 * @experimental Builds on an alpha primitive; the API may still change.
 *
 * Closes the surrounding drawer, also when it is not dismissible. Renders a button
 * unless `as` names another element or component.
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

useDrawerContext("mt-drawer-close");
</script>
