<script setup lang="ts">
import MtScrollArea from "@shopware-ag/meteor-component-library/MtScrollArea";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-scroll-area class="example-scroll-area">
    <div class="example-scroll-area__content">
      <mt-text>Order #10001</mt-text>
      <mt-text>Order #10002</mt-text>
      <mt-text>Order #10003</mt-text>
      <mt-text>Order #10004</mt-text>
      <mt-text>Order #10005</mt-text>
      <mt-text>Order #10006</mt-text>
      <mt-text>Order #10007</mt-text>
      <mt-text>Order #10008</mt-text>
      <mt-text>Order #10009</mt-text>
      <mt-text>Order #10010</mt-text>
      <mt-text>Order #10011</mt-text>
      <mt-text>Order #10012</mt-text>
    </div>
  </mt-scroll-area>
</template>

<style scoped>
.example-scroll-area {
  height: 200px;
  width: 280px;
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
