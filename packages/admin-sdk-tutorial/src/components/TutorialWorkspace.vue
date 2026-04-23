<script setup lang="ts">
import { ref } from 'vue';

import CodeEditorPanel from '@/components/CodeEditorPanel.vue';
import PreviewPanel from '@/components/PreviewPanel.vue';
import type { TutorialLesson } from '@/types/lesson';
import type { TutorialRunSnapshot } from '@/types/tutorialShell';

type CodeEditorPanelExposed = {
  getCode: () => string;
};

const props = defineProps<{
  lesson: TutorialLesson;
  code: string;
  editorResetVersion: number;
  runSnapshot: TutorialRunSnapshot;
  executionMessage: string;
  executionError: string | null;
  executionStatus: 'idle' | 'running' | 'success' | 'error';
  lastActionLabel: string;
}>();

const emit = defineEmits<{
  updateCode: [code: string];
  resetCode: [];
  runCode: [codeSnapshot: string];
  shellFrameWindow: [shellWindow: Window | null];
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

function handleShellFrameWindow(shellWindow: Window | null) {
  emit('shellFrameWindow', shellWindow);
}
</script>

<template>
  <section class="workspace">
    <div class="workspace__column workspace__column--editor">
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
      class="workspace__column workspace__column--preview"
      :run-snapshot="runSnapshot"
      :preview-label="lesson.previewLabel"
      :output-message="lesson.outputMessage"
      :execution-message="executionMessage"
      :execution-error="executionError"
      :execution-status="executionStatus"
      :last-action-label="lastActionLabel"
      @shell-frame-window="handleShellFrameWindow"
    />
  </section>
</template>

<style scoped>
.workspace {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: stretch;
  gap: 18px;
}

.workspace__column {
  min-width: 0;
  display: grid;
  gap: 14px;
}

.workspace__column--editor {
  padding: 20px;
  border: 1px solid #dce5f0;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.94);
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.05);
  backdrop-filter: blur(10px);
  min-height: min(880px, calc(100vh - 180px));
}

.workspace__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

@media (max-width: 1199px) {
  .workspace {
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
    gap: 18px;
  }
}

@media (max-width: 959px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .workspace__column--editor {
    min-height: 520px;
  }
}

@media (max-width: 720px) {
  .workspace {
    gap: 12px;
  }

  .workspace__column--editor {
    padding: 13px;
    border-radius: 18px;
  }

  .workspace__panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .workspace__actions {
    width: 100%;
  }

  .workspace__actions button {
    flex: 1 1 0;
    padding: 9px 12px;
  }
}
</style>
