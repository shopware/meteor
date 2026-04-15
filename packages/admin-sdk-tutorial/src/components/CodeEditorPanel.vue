<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from 'vue-codemirror6';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  title: string;
  description: string;
  task: string;
  code: string;
  resetVersion: number;
}>();

const emit = defineEmits<{
  updateCode: [code: string];
}>();

const localCode = ref(props.code);
const extensions = [javascript({ typescript: true }), oneDark];

watch(
  () => props.code,
  (nextCode) => {
    localCode.value = nextCode;
  },
);

watch(
  () => props.resetVersion,
  () => {
    localCode.value = props.code;
  },
);

const characterCount = computed(() => localCode.value.length);

function handleInput(nextCode?: string | { toString(): string }) {
  const normalizedCode = typeof nextCode === 'string' ? nextCode : nextCode?.toString() ?? '';

  localCode.value = normalizedCode;
  emit('updateCode', normalizedCode);
}
</script>

<template>
  <div class="editor-panel">
    <div class="editor-panel__header">
      <div>
        <p class="editor-panel__label">Editor</p>
        <h2>{{ title }}</h2>
      </div>

      <div class="editor-panel__tab">main.ts</div>
    </div>

    <p class="editor-panel__description">{{ description }}</p>

    <div class="editor-panel__task">
      <span>Try this</span>
      <p>{{ task }}</p>
    </div>

    <div class="editor-panel__surface">
      <CodeMirror
        class="editor-panel__codemirror"
        :model-value="localCode"
        :extensions="extensions"
        basic
        wrap
        @update:model-value="handleInput"
      />
    </div>

    <p class="editor-panel__meta">{{ characterCount }} characters</p>
  </div>
</template>

<style scoped>
.editor-panel {
  min-height: 0;
  display: grid;
  gap: 20px;
}

.editor-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.editor-panel__label {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-panel__header h2 {
  margin: 4px 0 0;
  font-size: 20px;
}

.editor-panel__tab {
  padding: 8px 12px;
  border: 1px solid #dce5f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #334155;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  font-weight: 600;
}

.editor-panel__description {
  margin: 0;
  color: #526072;
  line-height: 1.6;
}

.editor-panel__task {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #dbe7ff;
  border-radius: 14px;
  background: #f8fbff;
}

.editor-panel__task span {
  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-panel__task p {
  margin: 0;
  color: #334155;
  line-height: 1.6;
}

.editor-panel__surface {
  min-height: 0;
  border: 1px solid #0f172a;
  border-radius: 18px;
  overflow: hidden;
  background: #0f172a;
  color: #e2e8f0;
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 0.12);
}

.editor-panel__codemirror {
  min-height: 100%;
}

.editor-panel__meta {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

:deep(.cm-editor) {
  min-height: 460px;
  background: transparent;
}

:deep(.cm-scroller) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  line-height: 1.7;
}

:deep(.cm-content),
:deep(.cm-gutter) {
  padding-top: 18px;
  padding-bottom: 18px;
}

:deep(.cm-line) {
  padding-left: 6px;
}

:deep(.cm-focused) {
  outline: none;
}

@media (max-width: 1200px) {
  :deep(.cm-editor) {
    min-height: 360px;
  }
}
</style>
