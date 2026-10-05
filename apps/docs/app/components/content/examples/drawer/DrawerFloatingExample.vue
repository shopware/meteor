<script setup lang="ts">
import {
  MtButton,
  MtDrawerContent,
  MtDrawerRoot,
  MtDrawerTrigger,
  MtText,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-drawer-root>
    <mt-drawer-trigger :as="MtButton" variant="secondary">
      Show order
    </mt-drawer-trigger>

    <mt-drawer-content title="Order details" variant="floating" size="24rem">
      <mt-text size="xs">Shipped to Jane Doe, Berlin.</mt-text>
    </mt-drawer-content>
  </mt-drawer-root>
</template>
