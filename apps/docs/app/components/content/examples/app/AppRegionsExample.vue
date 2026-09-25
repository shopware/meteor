<script setup lang="ts">
import { ref } from "vue";
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const showHeader = ref(true);
const showStart = ref(true);
const showEnd = ref(false);
</script>

<template>
  <div class="app-regions">
    <div class="app-regions__controls">
      <mt-switch v-model="showHeader" label="Header" />
      <mt-switch v-model="showStart" label="Start sidebar" />
      <mt-switch v-model="showEnd" label="End sidebar" />
    </div>

    <mt-app class="app-regions__shell" :mobile-breakpoint="0">
      <template v-if="showHeader" #header>
        <div class="slot slot--header">
          <mt-text size="xs" color="color-text-secondary-default">header</mt-text>
        </div>
      </template>

      <template v-if="showStart" #sidebar-start>
        <div class="slot slot--sidebar">
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

      <template v-if="showEnd" #sidebar-end>
        <div class="slot slot--sidebar">
          <mt-text size="xs" color="color-text-secondary-default">
            sidebar-end
          </mt-text>
        </div>
      </template>
    </mt-app>
  </div>
</template>

<style scoped>
.app-regions {
  display: grid;
  gap: var(--scale-size-16);
  width: 100%;
}

.app-regions__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-16);
}

.app-regions__shell {
  --mt-app-height: 280px;

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

.slot--sidebar {
  width: var(--scale-size-160);
}

.slot--content {
  min-height: calc(100% - var(--scale-size-32));
  margin: var(--scale-size-16);
}
</style>
