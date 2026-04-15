<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import TutorialSidebar from '@/components/TutorialSidebar.vue';
import TutorialWorkspace from '@/components/TutorialWorkspace.vue';
import { lessons } from '@/lessons/lessons';
import { createRuntimeState, resetRuntimeState } from '@/runtime/createRuntimeState';
import { executeLessonCode } from '@/runtime/executeLessonCode';
import { createSdkBridge } from '@/runtime/sdkBridge';

const activeLessonId = ref(lessons[0]?.id ?? '');
const currentCode = ref(lessons[0]?.starterCode ?? '');
const editorResetVersion = ref(0);
const previewResetVersion = ref(0);
const executionMessage = ref('Ready to execute starter code.');
const executionError = ref<string | null>(null);

const activeLesson = computed(
  () => lessons.find((lesson) => lesson.id === activeLessonId.value) ?? lessons[0],
);

const runtimeState = ref(createRuntimeState(activeLesson.value));
const sdkBridge = createSdkBridge(runtimeState);

function runCurrentCode() {
  previewResetVersion.value += 1;
  sdkBridge.reset(resetRuntimeState(activeLesson.value));

  const result = executeLessonCode(currentCode.value, sdkBridge);

  executionMessage.value = result.message;
  executionError.value = result.error ?? null;
}

watch(activeLessonId, () => {
  currentCode.value = activeLesson.value.starterCode;
  editorResetVersion.value += 1;
  runCurrentCode();
});

function handleLessonSelect(lessonId: string) {
  activeLessonId.value = lessonId;
}

function handleCodeUpdate(code: string) {
  currentCode.value = code;
}

function handleCodeReset() {
  currentCode.value = activeLesson.value.starterCode;
  editorResetVersion.value += 1;
  executionMessage.value = 'Starter code restored. Run the lesson again to refresh the preview.';
  executionError.value = null;
}

runCurrentCode();
</script>

<template>
  <main class="app-shell">
    <TutorialSidebar
      :lessons="lessons"
      :active-lesson-id="activeLessonId"
      @select-lesson="handleLessonSelect"
    />
    <TutorialWorkspace
      :lesson="activeLesson"
      :code="currentCode"
      :editor-reset-version="editorResetVersion"
      :preview-reset-version="previewResetVersion"
      :runtime-state="runtimeState"
      :execution-message="executionMessage"
      :execution-error="executionError"
      @update-code="handleCodeUpdate"
      @reset-code="handleCodeReset"
      @run-code="runCurrentCode"
    />
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
}

:global(body) {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #eef2f7;
  color: #1f2937;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 20px;
  padding: 20px;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
</style>
