<script setup lang="ts">
import MtScrollArea from "@shopware-ag/meteor-component-library/MtScrollArea";
import MtBadge from "@shopware-ag/meteor-component-library/MtBadge";
</script>

<template>
  <mt-scroll-area orientation="horizontal" class="example-scroll-area">
    <div class="example-scroll-area__tags">
      <mt-badge>Clothing</mt-badge>
      <mt-badge>Shoes</mt-badge>
      <mt-badge>Accessories</mt-badge>
      <mt-badge>Sale</mt-badge>
      <mt-badge>New arrivals</mt-badge>
      <mt-badge>Outdoor</mt-badge>
      <mt-badge>Sports</mt-badge>
      <mt-badge>Kids</mt-badge>
      <mt-badge>Home</mt-badge>
      <mt-badge>Garden</mt-badge>
    </div>
  </mt-scroll-area>
</template>

<style scoped>
.example-scroll-area {
  width: 320px;
}

.example-scroll-area__tags {
  display: flex;
  gap: var(--scale-size-8);
  padding-block: var(--scale-size-4) var(--scale-size-12);
  white-space: nowrap;
}
</style>
