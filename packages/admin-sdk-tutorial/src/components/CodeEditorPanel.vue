<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  title: string;
  description: string;
  code: string;
  resetVersion: number;
}>();

const emit = defineEmits<{
  updateCode: [code: string];
}>();

const localCode = ref(props.code);

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

const lineNumbers = computed(() => {
  const totalLines = localCode.value.split('\n').length;

  return Array.from({ length: totalLines }, (_, index) => index + 1);
});

function handleInput(event: Event) {
  const nextCode = (event.target as HTMLTextAreaElement).value;

  localCode.value = nextCode;
  emit('updateCode', nextCode);
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

    <div class="editor-panel__surface">
      <div class="editor-panel__gutter">
        <span v-for="lineNumber in lineNumbers" :key="lineNumber">{{ lineNumber }}</span>
      </div>

      <textarea
        class="editor-panel__input"
        :value="localCode"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-panel {
  min-height: 0;
  display: grid;
  gap: 18px;
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
  border: 1px solid #d7dfeb;
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

.editor-panel__surface {
  min-height: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  border: 1px solid #dbe2ec;
  border-radius: 16px;
  overflow: hidden;
  background: #0f172a;
  color: #e2e8f0;
}

.editor-panel__gutter {
  display: grid;
  align-content: start;
  gap: 4px;
  padding: 20px 14px;
  background: #111b31;
  color: #64748b;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
}

.editor-panel__input {
  min-height: 100%;
  padding: 20px;
  border: 0;
  resize: none;
  outline: none;
  background: transparent;
  color: inherit;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre;
  tab-size: 2;
}
</style>
