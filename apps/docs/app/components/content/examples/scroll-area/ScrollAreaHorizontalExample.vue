<script setup lang="ts">
import MtScrollArea from "@shopware-ag/meteor-component-library/MtScrollArea";
import MtBadge from "@shopware-ag/meteor-component-library/MtBadge";
</script>

<template>
  <mt-scroll-area orientation="horizontal" class="example-scroll-area">
    <div class="example-scroll-area__content">
      <mt-badge>Order #243</mt-badge>
      <mt-badge>Order #244</mt-badge>
      <mt-badge>Order #245</mt-badge>
      <mt-badge>Order #246</mt-badge>
      <mt-badge>Order #247</mt-badge>
      <mt-badge>Order #248</mt-badge>
      <mt-badge>Order #249</mt-badge>
      <mt-badge>Order #250</mt-badge>
      <mt-badge>Order #251</mt-badge>
      <mt-badge>Order #252</mt-badge>
    </div>
  </mt-scroll-area>
</template>

<style scoped>
.example-scroll-area {
  width: 320px;
}

.example-scroll-area__content {
  display: flex;
  gap: var(--scale-size-8);
  padding-block: var(--scale-size-4) var(--scale-size-12);
  white-space: nowrap;
}
</style>
