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
 * Closes the surrounding drawer, also when it is not dismissible. Renders a button
 * unless `as` names another element or component.
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

useDrawerContext("mt-drawer-close");
</script>
