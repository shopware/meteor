<script setup lang="ts">
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-app class="app-example" :mobile-breakpoint="0">
    <template #header>
      <div class="slot slot--header">
        <mt-text size="xs" color="color-text-secondary-default">header</mt-text>
      </div>
    </template>

    <template #sidebar-start>
      <div class="slot slot--sidebar-start">
        <mt-text size="xs" color="color-text-secondary-default">
          sidebar-start
        </mt-text>
      </div>
    </template>

    <template #content>
      <div class="slot slot--content">
        <mt-text size="xs" color="color-text-secondary-default">content</mt-text>
      </div>
    </template>

    <template #sidebar-end>
      <div class="slot slot--sidebar-end">
        <mt-text size="xs" color="color-text-secondary-default">
          sidebar-end
        </mt-text>
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-example {
  --mt-app-height: 360px;

  border-radius: var(--border-radius-m);
}

.slot {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  height: 100%;
  background-color: var(--color-background-secondary-default);
  border: 1px dashed var(--color-border-primary-default);
  border-radius: var(--border-radius-m);
}

.slot--header {
  height: var(--scale-size-56);
  margin: var(--scale-size-8);
}

.slot--sidebar-start {
  width: var(--scale-size-160);
}

.slot--sidebar-end {
  width: var(--scale-size-192);
}

.slot--content {
  min-height: calc(100% - var(--scale-size-32));
  margin: var(--scale-size-16);
}
</style>
