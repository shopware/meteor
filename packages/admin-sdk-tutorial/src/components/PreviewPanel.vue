<script setup lang="ts">
import DummyAdminShell from '@/components/DummyAdminShell.vue';
import type { TutorialRuntimeState } from '@/types/runtime';

defineProps<{
  runtimeState: TutorialRuntimeState;
  previewResetVersion: number;
  outputMessage: string;
  executionMessage: string;
  executionError: string | null;
}>();
</script>

<template>
  <div class="preview-stack">
    <section class="preview-panel">
      <div class="preview-panel__header">
        <div>
          <p class="preview-panel__label">Preview</p>
          <h2>Dummy admin shell</h2>
        </div>
        <span class="preview-panel__status">{{ runtimeState.statusLabel }}</span>
      </div>

      <DummyAdminShell
        :runtime-state="runtimeState"
      />
    </section>

    <section class="preview-panel preview-panel--output">
      <div class="preview-panel__header">
        <div>
          <p class="preview-panel__label">Output</p>
          <h2>Status</h2>
        </div>
      </div>

      <p class="preview-panel__output-message">{{ outputMessage }}</p>
      <p class="preview-panel__output-empty">{{ executionMessage }}</p>
      <p v-if="executionError" class="preview-panel__output-error">{{ executionError }}</p>
    </section>
  </div>
</template>

<style scoped>
.preview-stack {
  min-width: 0;
  display: grid;
  gap: 16px;
  grid-template-rows: minmax(0, 1fr) auto;
}

.preview-panel {
  min-width: 0;
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid #d8e0eb;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.preview-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.preview-panel__header h2 {
  margin: 4px 0 0;
  font-size: 20px;
}

.preview-panel__label {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-panel__status {
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 13px;
  font-weight: 700;
}

.preview-panel__output-message,
.preview-panel__output-empty {
  margin: 0;
  color: #526072;
  line-height: 1.6;
}

.preview-panel__output-empty {
  padding: 12px 14px;
  border: 1px dashed #d8e0eb;
  border-radius: 14px;
  background: #f8fafc;
}

.preview-panel__output-error {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 14px;
  background: #fef2f2;
  color: #b91c1c;
  line-height: 1.6;
}

@media (max-width: 720px) {
  .preview-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
