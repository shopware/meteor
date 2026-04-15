<script setup lang="ts">
import { ref } from 'vue';

import CodeEditorPanel from '@/components/CodeEditorPanel.vue';
import PreviewPanel from '@/components/PreviewPanel.vue';
import type { TutorialLesson } from '@/types/lesson';
import type { TutorialRuntimeState } from '@/types/runtime';

type CodeEditorPanelExposed = {
  getCode: () => string;
};

const props = defineProps<{
  lesson: TutorialLesson;
  code: string;
  iframeRunCode: string;
  editorResetVersion: number;
  previewResetVersion: number;
  runtimeState: TutorialRuntimeState;
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
  updateCode: [code: string];
  resetCode: [];
  runCode: [codeSnapshot: string];
  runtimeFrameWindow: [runtimeWindow: Window | null];
}>();

const editorPanel = ref<CodeEditorPanelExposed | null>(null);

function handleCodeUpdate(code: string) {
  emit('updateCode', code);
}

function resetCode() {
  emit('resetCode');
}

function runCode() {
  emit('runCode', editorPanel.value?.getCode() ?? props.code);
}

function handleRuntimeFrameWindow(runtimeWindow: Window | null) {
  emit('runtimeFrameWindow', runtimeWindow);
}
</script>

<template>
  <section class="workspace">
    <div class="workspace__panel workspace__panel--editor">
      <div class="workspace__panel-header">
        <div class="workspace__actions">
          <button type="button" @click="resetCode">Reset</button>
          <button type="button" class="workspace__button--primary" @click="runCode">Run</button>
        </div>
      </div>

      <CodeEditorPanel
        ref="editorPanel"
        :title="lesson.title"
        :description="lesson.description"
        :task="lesson.task"
        :objective="lesson.objective"
        :code="code"
        :reset-version="editorResetVersion"
        @update-code="handleCodeUpdate"
      />
    </div>

    <PreviewPanel
      :runtime-state="runtimeState"
      :code="code"
      :iframe-run-code="iframeRunCode"
      :preview-reset-version="previewResetVersion"
      :output-message="lesson.outputMessage"
      :execution-message="executionMessage"
      :execution-error="executionError"
      :execution-status="executionStatus"
      :last-action-label="lastActionLabel"
      :lesson-id="lesson.id"
      :iframe-status="iframeStatus"
      :last-sdk-message-type="lastSdkMessageType"
      :registered-source-count="registeredSourceCount"
      :runtime-location-id="runtimeLocationId"
      @runtime-frame-window="handleRuntimeFrameWindow"
    />
  </section>
</template>

<style scoped>
.workspace {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(380px, 0.96fr);
  gap: 18px;
}

.workspace__panel {
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

.workspace__panel--editor {
  min-height: calc(100vh - 40px);
}

.workspace__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.workspace__panel-header h2 {
  margin: 4px 0 0;
  font-size: 20px;
}

.workspace__actions {
  display: flex;
  gap: 10px;
}

.workspace__actions button {
  padding: 10px 15px;
  border: 1px solid #d7dfeb;
  border-radius: 12px;
  background: #ffffff;
  color: #1f2937;
  font: inherit;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.workspace__actions button:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgb(15 23 42 / 0.06);
}

.workspace__button--primary {
  border-color: #4f46e5 !important;
  background: #4f46e5 !important;
  color: #ffffff !important;
}

@media (max-width: 1200px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .workspace__panel--editor {
    min-height: 520px;
  }
}

@media (max-width: 720px) {
  .workspace__panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
