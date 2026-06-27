<script setup lang="ts">
import { ref } from "vue";
import MtFloatingUi from "@shopware-ag/meteor-component-library/MtFloatingUi";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";

const isOpened = ref(false);
const width = ref(120);
const height = ref(120);
</script>

<template>
  <mt-floating-ui
    :is-opened="isOpened"
    show-arrow
    :offset="6"
    @close="isOpened = false"
  >
    <template #trigger>
      <mt-button variant="secondary" @click="isOpened = !isOpened">
        Toggle floating UI
      </mt-button>
    </template>

    <div class="floating-surface">
      <strong class="floating-surface__title">Adjust size</strong>
      <div class="floating-surface__fields">
        <mt-number-field
          v-model="width"
          label="Width"
          size="small"
          number-type="int"
        />
        <mt-number-field
          v-model="height"
          label="Height"
          size="small"
          number-type="int"
        />
      </div>
      <mt-button size="small" variant="primary">Apply</mt-button>
    </div>
  </mt-floating-ui>
</template>

<style scoped>
.floating-surface {
  width: 320px;
  padding: 16px;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-raised);
  box-shadow: 0 6px 24px -8px rgba(16, 16, 19, 0.1);
}

.floating-surface__title {
  display: block;
  margin-bottom: 10px;
}

.floating-surface__fields {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}
</style>
