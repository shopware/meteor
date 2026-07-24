<script setup lang="ts">
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import { iconCommonUsages as commonUsages } from "#shared/data/iconCommonUsages";
</script>

<template>
  <div class="common-usages">
    <div v-for="usage in commonUsages" :key="usage.icon" class="usage">
      <div class="usage__icon">
        <MtIcon
          :name="usage.icon"
          mode="regular"
          size="var(--scale-size-20)"
          color="var(--color-icon-primary-default)"
          decorative
        />
      </div>
      <div class="usage__meta">
        <strong>{{ usage.label }}</strong>
        <code>{{ usage.icon }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.common-usages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.usage {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.usage__icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-s);
  background: var(--color-background-tertiary-default);
}

.usage__meta {
  display: grid;
  gap: 4px;
  min-width: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.usage__meta code {
  font-size: var(--font-size-2xs);
  color: var(--color-text-secondary-default);
}
</style>
