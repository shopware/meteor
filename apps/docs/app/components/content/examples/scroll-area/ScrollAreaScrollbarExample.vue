<script setup lang="ts">
import MtScrollArea from "@shopware-ag/meteor-component-library/MtScrollArea";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-scroll-area scrollbar class="example-scroll-area">
    <div class="example-scroll-area__content">
      <mt-text>Order #10001 was placed</mt-text>
      <mt-text>Payment for order #10001 was received</mt-text>
      <mt-text>Order #10001 was shipped</mt-text>
      <mt-text>Order #10002 was placed</mt-text>
      <mt-text>Order #10002 was cancelled</mt-text>
      <mt-text>Order #10003 was placed</mt-text>
      <mt-text>Payment for order #10003 was received</mt-text>
      <mt-text>Order #10003 was shipped</mt-text>
      <mt-text>Order #10003 was delivered</mt-text>
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
