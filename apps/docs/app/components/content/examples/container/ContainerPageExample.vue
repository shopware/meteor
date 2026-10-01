<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtContainer from "@shopware-ag/meteor-component-library/MtContainer";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <div class="page">
    <mt-container as="section" size="s">
      <mt-card title="Account">
        <mt-text size="xs">Forms read best at the small width.</mt-text>
      </mt-card>
    </mt-container>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  padding: var(--scale-size-24);
}
</style>
