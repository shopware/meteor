<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import DummyAdminShell from '@/components/DummyAdminShell.vue';
import type { TutorialRuntimeState } from '@/types/runtime';

const props = defineProps<{
  runtimeState: TutorialRuntimeState;
  code: string;
  iframeRunCode: string;
  lessonId: string;
  previewResetVersion: number;
  outputMessage: string;
  executionMessage: string;
  executionError: string | null;
  executionStatus: 'idle' | 'success' | 'error';
  lastActionLabel: string;
  iframeStatus: string;
  lastSdkMessageType: string;
  registeredSourceCount: number;
  runtimeLocationId: string;
}>();

const emit = defineEmits<{
  runtimeFrameWindow: [runtimeWindow: Window | null];
}>();

const runtimeFrame = ref<HTMLIFrameElement | null>(null);

const runtimeFrameSrc = computed(
  () =>
    `/iframe-runtime.html?lesson-id=${props.lessonId}&location-id=${props.runtimeLocationId}&run-version=${props.previewResetVersion}`,
);

function syncRuntimeFrame() {
  emit('runtimeFrameWindow', runtimeFrame.value?.contentWindow ?? null);

  runtimeFrame.value?.contentWindow?.postMessage(
    {
      source: 'tutorial-host',
      type: 'tutorial:set-code',
      lessonId: props.lessonId,
      locationId: props.runtimeLocationId,
      code: props.code,
      runCode: props.iframeRunCode,
      runVersion: props.previewResetVersion,
    },
    '*',
  );
}

watch(
  () => [props.code, props.lessonId, props.previewResetVersion, props.runtimeLocationId],
  () => {
    syncRuntimeFrame();
  },
);
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

      <div class="preview-panel__frame">
        <DummyAdminShell
          :runtime-state="runtimeState"
          :lesson-id="lessonId"
          :code="code"
          :run-code="iframeRunCode"
          :run-version="previewResetVersion"
        />
      </div>

      <div class="preview-panel__runtime-card">
        <div class="preview-panel__runtime-header">
          <div>
            <p class="preview-panel__label">Lesson runtime iframe</p>
            <h3>{{ iframeStatus }}</h3>
          </div>
          <div class="preview-panel__meta">
            <span class="preview-panel__counter">{{ lastSdkMessageType }}</span>
            <span class="preview-panel__counter">sources: {{ registeredSourceCount }}</span>
          </div>
        </div>

        <iframe
          ref="runtimeFrame"
          class="preview-panel__runtime-frame"
          :src="runtimeFrameSrc"
          title="Lesson runtime iframe"
          @load="syncRuntimeFrame"
        />
      </div>
    </section>

    <section class="preview-panel preview-panel--output">
      <div class="preview-panel__header">
        <div>
          <p class="preview-panel__label">Output</p>
          <h2>Status</h2>
        </div>
        <div class="preview-panel__meta">
          <span class="preview-panel__counter">{{ lastActionLabel }}</span>
          <span class="preview-panel__state" :class="`preview-panel__state--${executionStatus}`">
            {{ executionStatus }}
          </span>
        </div>
      </div>

      <div class="preview-panel__copy-block">
        <span>What to observe</span>
        <p class="preview-panel__output-message">{{ outputMessage }}</p>
      </div>
      <div
        v-if="executionStatus !== 'error'"
        class="preview-panel__copy-block preview-panel__copy-block--muted"
      >
        <span>Execution</span>
        <p class="preview-panel__output-empty">{{ executionMessage }}</p>
      </div>
      <p v-if="executionError" class="preview-panel__output-error">
        <strong>Execution failed</strong>
        <span>{{ executionMessage }}</span>
        <span>{{ executionError }}</span>
      </p>
    </section>
  </div>
</template>

<style scoped>
.preview-stack {
  min-width: 0;
  display: grid;
  gap: 18px;
  grid-template-rows: minmax(0, 1fr) auto;
}

.preview-panel {
  min-width: 0;
  display: grid;
  gap: 18px;
  padding: 22px;
  border: 1px solid #dce5f0;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.94);
  box-shadow: 0 18px 48px rgb(15 23 42 / 0.06);
  backdrop-filter: blur(10px);
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

.preview-panel__runtime-header h3 {
  margin: 4px 0 0;
  font-size: 16px;
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

.preview-panel__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-panel__counter {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.preview-panel__state {
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.preview-panel__state--idle {
  background: #e2e8f0;
  color: #334155;
}

.preview-panel__state--success {
  background: #dcfce7;
  color: #166534;
}

.preview-panel__state--error {
  background: #fee2e2;
  color: #b91c1c;
}

.preview-panel__output-message,
.preview-panel__output-empty {
  margin: 0;
  color: #526072;
  line-height: 1.6;
}

.preview-panel__copy-block {
  display: grid;
  gap: 8px;
}

.preview-panel__copy-block span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-panel__copy-block--muted {
  padding: 12px 14px;
  border: 1px dashed #d8e0eb;
  border-radius: 14px;
  background: #f8fafc;
}

.preview-panel__frame {
  min-width: 0;
  aspect-ratio: 16 / 10;
  min-height: 340px;
  max-height: 520px;
  padding: 14px;
  border: 1px solid #d8e0eb;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.preview-panel__runtime-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #d8e0eb;
  border-radius: 18px;
  background: #f8fafc;
}

.preview-panel__runtime-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.preview-panel__runtime-frame {
  width: 100%;
  min-height: 180px;
  border: 1px solid #d8e0eb;
  border-radius: 14px;
  background: #ffffff;
}

.preview-panel__output-error {
  margin: 0;
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 14px;
  background: #fef2f2;
  color: #b91c1c;
  line-height: 1.6;
}

.preview-panel__output-error strong,
.preview-panel__output-error span {
  display: block;
}

@media (max-width: 720px) {
  .preview-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-panel__meta {
    flex-wrap: wrap;
  }

  .preview-panel__frame {
    aspect-ratio: auto;
    min-height: 420px;
  }

  .preview-panel__runtime-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
