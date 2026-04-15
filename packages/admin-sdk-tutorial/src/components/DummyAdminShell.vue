<script setup lang="ts">
import type { TutorialRuntimeState } from '@/types/runtime';

defineProps<{
  runtimeState: TutorialRuntimeState;
}>();
</script>

<template>
  <div class="dummy-admin">
    <aside class="dummy-admin__sidebar">
      <strong>Admin</strong>
      <div v-for="menuItem in runtimeState.menuItems" :key="menuItem.id" class="dummy-admin__menu-item">
        <span>{{ menuItem.label }}</span>
        <small v-if="menuItem.kind === 'dynamic'">New</small>
      </div>
    </aside>

    <div class="dummy-admin__content">
      <div
        class="dummy-admin__notification"
        :class="`dummy-admin__notification--${runtimeState.notificationTone}`"
      >
        <strong>{{ runtimeState.notificationTitle }}</strong>
        <p>{{ runtimeState.notificationMessage }}</p>
      </div>

      <div class="dummy-admin__empty-state">
        <strong>{{ runtimeState.emptyStateTitle }}</strong>
        <p>
          {{ runtimeState.emptyStateMessage }}
        </p>
      </div>

      <div class="dummy-admin__canvas">
        <div
          v-for="surface in runtimeState.surfaces"
          :key="surface.id"
          class="dummy-admin__card"
          :class="{ 'dummy-admin__card--ghost': surface.variant === 'ghost' }"
        >
          <span v-if="surface.slotLabel" class="dummy-admin__card-label">{{ surface.slotLabel }}</span>
          <strong class="dummy-admin__card-title">{{ surface.title }}</strong>
          <p>{{ surface.description }}</p>
          <div v-if="surface.injectedContent" class="dummy-admin__card-injected">
            {{ surface.injectedContent }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dummy-admin {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  min-height: 360px;
  border: 1px solid #dbe2ec;
  border-radius: 18px;
  overflow: hidden;
  background: #f8fafc;
}

.dummy-admin__sidebar {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 18px 16px;
  background: #111827;
  color: #e5eefb;
}

.dummy-admin__menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dummy-admin__sidebar span {
  color: #b8c3d4;
  font-size: 14px;
}

.dummy-admin__menu-item small {
  padding: 2px 6px;
  border-radius: 999px;
  background: #312e81;
  color: #c7d2fe;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.dummy-admin__content {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 16px;
}

.dummy-admin__notification {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
}

.dummy-admin__notification strong {
  font-size: 14px;
}

.dummy-admin__notification p {
  margin: 0;
}

.dummy-admin__notification--info {
  border: 1px dashed #c7d2fe;
  background: #eef2ff;
  color: #4338ca;
}

.dummy-admin__notification--success {
  border: 1px dashed #86efac;
  background: #f0fdf4;
  color: #166534;
}

.dummy-admin__empty-state {
  padding: 14px 16px;
  border: 1px solid #d8e0eb;
  border-radius: 14px;
  background: #ffffff;
}

.dummy-admin__empty-state strong {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

.dummy-admin__card-title {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.dummy-admin__card-label {
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.dummy-admin__empty-state p,
.dummy-admin__card p {
  margin: 0;
  color: #526072;
  line-height: 1.6;
}

.dummy-admin__card-injected {
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px dashed #93c5fd;
  border-radius: 12px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.dummy-admin__canvas {
  display: grid;
  gap: 14px;
}

.dummy-admin__card {
  min-height: 120px;
  padding: 16px;
  border: 1px solid #d8e0eb;
  border-radius: 16px;
  background: #ffffff;
}

.dummy-admin__card--ghost {
  border-style: dashed;
  background: #f8fafc;
}

@media (max-width: 720px) {
  .dummy-admin {
    grid-template-columns: 1fr;
  }

  .dummy-admin__sidebar {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    align-items: center;
    overflow: auto;
  }
}
</style>
