<script setup lang="ts">
import MtDivider from "@shopware-ag/meteor-component-library/MtDivider";
</script>

<template>
  <div style="display: grid; gap: var(--scale-size-16)">
    <mt-divider />
    <mt-divider variant="dashed" />
    <mt-divider color="color-border-brand-default" />
    <mt-divider variant="dashed" color="color-border-brand-default" />
  </div>
</template>
