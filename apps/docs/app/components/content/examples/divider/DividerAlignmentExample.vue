<script setup lang="ts">
import MtDivider from "@shopware-ag/meteor-component-library/MtDivider";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <div style="display: grid; gap: var(--scale-size-24)">
    <mt-divider alignment="left">
      <mt-text size="xs" color="color-text-secondary-default"
        >Customer details</mt-text
      >
    </mt-divider>
    <mt-divider>
      <mt-text size="xs" color="color-text-secondary-default"
        >New messages</mt-text
      >
    </mt-divider>
    <mt-divider alignment="right">
      <mt-text size="xs" color="color-text-secondary-default"
        >Updated 5 minutes ago</mt-text
      >
    </mt-divider>
  </div>
</template>
