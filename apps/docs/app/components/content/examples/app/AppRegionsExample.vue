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

    <mt-app
      class="app-regions__shell"
      :breakpoint="0"
      :apply-theme="false"
      :future="{ all: true }"
      :snackbar="false"
      :lock-document="false"
    >
      <template v-if="showHeader" #header>
        <div class="app-regions__region">
          <mt-text as="span" size="xs" weight="semibold">Header</mt-text>
        </div>
      </template>

      <template v-if="showStart" #sidebar-start>
        <div class="app-regions__region app-regions__sidebar">
          <mt-text as="span" size="xs" weight="semibold">Start sidebar</mt-text>
        </div>
      </template>

      <template #content>
        <div class="app-regions__region">
          <mt-text size="xs">
            Sidebars and content sit directly below the header, with 8px between
            them and towards the shell edges. Without a header, that spacing
            applies at the top too. Absent regions leave no gap behind.
          </mt-text>
        </div>
      </template>

      <template v-if="showEnd" #sidebar-end>
        <div class="app-regions__region app-regions__sidebar">
          <mt-text as="span" size="xs" weight="semibold">End sidebar</mt-text>
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

.app-regions__region {
  padding: var(--scale-size-16);
}

.app-regions__sidebar {
  width: var(--scale-size-160);
}
</style>
