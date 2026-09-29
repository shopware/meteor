<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtDivider from "@shopware-ag/meteor-component-library/MtDivider";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-card title="Full bleed">
    <div style="display: grid; gap: var(--scale-size-24)">
      <mt-text>The divider below stretches across the card padding.</mt-text>
      <mt-divider full-bleed />
      <mt-text>The divider above ignores the card padding.</mt-text>
    </div>
  </mt-card>
</template>
