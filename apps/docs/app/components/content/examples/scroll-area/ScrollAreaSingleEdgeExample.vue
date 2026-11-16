<script setup lang="ts">
import MtScrollArea from "@shopware-ag/meteor-component-library/MtScrollArea";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-scroll-area fade="end" :fade-size="32" class="example-scroll-area">
    <div class="example-scroll-area__content">
      <mt-text>Order #243</mt-text>
      <mt-text>Order #244</mt-text>
      <mt-text>Order #245</mt-text>
      <mt-text>Order #246</mt-text>
      <mt-text>Order #247</mt-text>
      <mt-text>Order #248</mt-text>
      <mt-text>Order #249</mt-text>
      <mt-text>Order #250</mt-text>
      <mt-text>Order #251</mt-text>
      <mt-text>Order #252</mt-text>
      <mt-text>Order #253</mt-text>
      <mt-text>Order #254</mt-text>
    </div>
  </mt-scroll-area>
</template>

<style scoped>
.example-scroll-area {
  height: 200px;
  width: 320px;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-m);
}

.example-scroll-area__content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
  padding: var(--scale-size-12) var(--scale-size-16);
}
</style>
