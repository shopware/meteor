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
const executionStatus = ref<'idle' | 'success' | 'error'>('idle');
const lastActionLabel = ref('Not run yet');

const activeLesson = computed(
  () => lessons.find((lesson) => lesson.id === activeLessonId.value) ?? lessons[0],
);

function cloneRuntimeState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const runtimeState = ref(createRuntimeState(activeLesson.value));
const sdkBridge = createSdkBridge(runtimeState);
const lastSuccessfulRuntimeState = ref(cloneRuntimeState(runtimeState.value));

function getSuccessMessage() {
  if (activeLesson.value.id === 'notifications') {
    return 'Success: the notification call updated the host toast preview.';
  }

  if (activeLesson.value.id === 'menu-items') {
    return 'Success: the menu registration updated the dummy admin navigation.';
  }

  return 'Success: the location render call moved content into the targeted host slot.';
}

function getResetMessage() {
  return `Starter code restored and re-run for ${activeLesson.value.title}.`;
}

function runCurrentCode(source: 'run' | 'reset' | 'lesson-change' = 'run') {
  previewResetVersion.value += 1;
  sdkBridge.reset(resetRuntimeState(activeLesson.value));

  const result = executeLessonCode(currentCode.value, sdkBridge);

  if (result.ok) {
    lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
  } else {
    runtimeState.value = cloneRuntimeState(lastSuccessfulRuntimeState.value);
  }

  executionMessage.value = result.ok
    ? source === 'reset'
      ? getResetMessage()
      : getSuccessMessage()
    : `${activeLesson.value.title} run failed.`;
  executionError.value = result.error ?? null;
  executionStatus.value = result.ok ? 'success' : 'error';
  lastActionLabel.value =
    source === 'reset'
      ? `Reset + run ${previewResetVersion.value}`
      : source === 'lesson-change'
        ? `Lesson load ${previewResetVersion.value}`
        : `Run ${previewResetVersion.value}`;
}

watch(activeLessonId, () => {
  currentCode.value = activeLesson.value.starterCode;
  editorResetVersion.value += 1;
  lastSuccessfulRuntimeState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
  runCurrentCode('lesson-change');
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
  runCurrentCode('reset');
}

runCurrentCode('lesson-change');
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
      :execution-status="executionStatus"
      :last-action-label="lastActionLabel"
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
  background:
    radial-gradient(circle at top left, rgb(79 70 229 / 0.08), transparent 30%),
    linear-gradient(180deg, #f4f7fb 0%, #eef2f7 100%);
  color: #1f2937;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(340px, 430px) minmax(0, 1fr);
  gap: 24px;
  padding: 24px;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
</style>
