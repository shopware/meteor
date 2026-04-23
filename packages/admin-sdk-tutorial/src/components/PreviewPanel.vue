<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { TutorialRunSnapshot } from '@/types/tutorialShell';

const props = defineProps<{
  runSnapshot: TutorialRunSnapshot;
  previewLabel: string;
  outputMessage: string;
  executionMessage: string;
  executionError: string | null;
  executionStatus: 'idle' | 'running' | 'success' | 'error';
  lastActionLabel: string;
}>();

const emit = defineEmits<{
  shellFrameWindow: [shellWindow: Window | null];
}>();

const shellFrame = ref<HTMLIFrameElement | null>(null);

const shellFrameSrc = computed(
  () =>
    `/dummy-admin-shell.html?lesson-id=${props.runSnapshot.lessonId}&run-version=${props.runSnapshot.runVersion}`,
);

function syncShellFrame() {
  emit('shellFrameWindow', shellFrame.value?.contentWindow ?? null);

  shellFrame.value?.contentWindow?.postMessage(
    JSON.stringify({
      source: 'tutorial-parent',
      type: 'tutorial:set-run-snapshot',
      payload: props.runSnapshot,
    }),
    '*',
  );
}

watch(
  () => props.runSnapshot,
  () => {
    syncShellFrame();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div class="preview-stack">
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

      <div class="preview-panel__output-grid">
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
      </div>
    </section>

    <section class="preview-panel preview-panel--preview">
      <div class="preview-panel__header">
        <div>
          <p class="preview-panel__label">Preview</p>
          <h2>Dummy admin shell</h2>
        </div>
        <span class="preview-panel__status">{{ previewLabel }}</span>
      </div>

      <div class="preview-panel__frame">
        <iframe
          ref="shellFrame"
          class="preview-panel__shell-frame"
          :src="shellFrameSrc"
          title="Dummy admin shell preview"
          @load="syncShellFrame"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.preview-stack {
  min-width: 0;
  display: grid;
  gap: 14px;
  height: 100%;
  grid-template-rows: auto minmax(0, 1fr);
}

.preview-panel {
  min-width: 0;
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #dce5f0;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.94);
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.05);
  backdrop-filter: blur(10px);
}

.preview-panel--output {
  align-content: start;
}

.preview-panel--preview {
  grid-template-rows: auto minmax(0, 1fr);
}

.preview-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.preview-panel__header h2 {
  margin: 4px 0 0;
  font-size: 18px;
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
  flex-wrap: wrap;
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

.preview-panel__state--running {
  background: #dbeafe;
  color: #1d4ed8;
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

.preview-panel__output-grid {
  display: grid;
  gap: 12px;
  max-height: 220px;
  overflow: auto;
}

.preview-panel__copy-block span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-panel__copy-block--muted {
  padding: 10px 12px;
  border: 1px solid #e6ebf2;
  border-radius: 14px;
  background: #fbfcfe;
}

.preview-panel__frame {
  min-width: 0;
  min-height: 480px;
  max-height: none;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.preview-panel__shell-frame {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: 0;
  border-radius: 16px;
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
  .preview-stack {
    gap: 10px;
  }

  .preview-panel {
    gap: 10px;
    padding: 12px;
    border-radius: 18px;
  }

  .preview-panel__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .preview-panel__meta {
    flex-wrap: wrap;
  }

  .preview-panel__status,
  .preview-panel__state {
    font-size: 11px;
  }

  .preview-panel__output-grid {
    gap: 9px;
    max-height: 172px;
  }

  .preview-panel__copy-block--muted,
  .preview-panel__output-error {
    padding: 9px 11px;
  }

  .preview-panel__frame {
    min-height: 392px;
    padding: 3px;
    border-radius: 16px;
  }

  .preview-panel__shell-frame {
    border-radius: 12px;
  }
}
</style>
