<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import TutorialTopbar from '@/components/TutorialTopbar.vue';
import TutorialWorkspace from '@/components/TutorialWorkspace.vue';
import { lessons } from '@/lessons/lessons';
import type { TutorialLesson } from '@/types/lesson';
import { parseTutorialShellMessage, type TutorialRunSnapshot } from '@/types/tutorialShell';

const activeLessonId = ref(lessons[0]?.id ?? '');
const currentCode = ref(lessons[0]?.starterCode ?? '');
const editorResetVersion = ref(0);
const runVersion = ref(0);
const executionMessage = ref('Ready to execute starter code.');
const executionError = ref<string | null>(null);
const executionStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');
const lastActionLabel = ref('Not run yet');
const shellFrameWindow = ref<Window | null>(null);
const runSnapshot = ref<TutorialRunSnapshot>({
  lessonId: lessons[0]?.id ?? '',
  code: lessons[0]?.starterCode ?? '',
  runCode: lessons[0]?.starterCode ?? '',
  runVersion: 0,
  runtimeLocationId: lessons[0]?.runtimeLocationId ?? 'sw-main-hidden',
});

const activeLesson = computed(
  () => lessons.find((lesson) => lesson.id === activeLessonId.value) ?? lessons[0],
);

function createRunSnapshot(lesson: TutorialLesson, code: string): TutorialRunSnapshot {
  return {
    lessonId: lesson.id,
    code,
    runCode: code,
    runVersion: runVersion.value,
    runtimeLocationId: lesson.runtimeLocationId,
  };
}

function getRunningMessage(lessonId: string) {
  if (lessonId === 'notifications') {
    return 'Running real Admin SDK notification code inside the hidden extension runtime…';
  }

  if (lessonId === 'menu-items') {
    return 'Running real Admin SDK menu code inside the hidden extension runtime…';
  }

  return 'Running real location registration code inside the hidden extension runtime…';
}

function getSuccessMessage(lessonId: string) {
  if (lessonId === 'notifications') {
    return 'Success: the real notification API updated the dummy admin shell.';
  }

  if (lessonId === 'menu-items') {
    return 'Success: the real menu API updated the dummy admin shell navigation.';
  }

  return 'Success: the real location registration rendered inside the dummy admin shell.';
}

function runCurrentCode(source: 'run' | 'reset' | 'lesson-change' = 'run', codeSnapshot?: string) {
  const lesson = activeLesson.value;
  const nextCode = codeSnapshot ?? currentCode.value;

  currentCode.value = nextCode;
  runVersion.value += 1;
  runSnapshot.value = createRunSnapshot(lesson, nextCode);
  executionError.value = null;
  executionStatus.value = 'running';
  executionMessage.value = getRunningMessage(lesson.id);
  lastActionLabel.value =
    source === 'reset'
      ? `Reset + run ${runVersion.value}`
      : source === 'lesson-change'
        ? `Lesson load ${runVersion.value}`
        : `Run ${runVersion.value}`;
}

watch(activeLessonId, () => {
  currentCode.value = activeLesson.value.starterCode;
  editorResetVersion.value += 1;
  runCurrentCode('lesson-change', activeLesson.value.starterCode);
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
  runCurrentCode('reset', activeLesson.value.starterCode);
}

function handleRunCode(codeSnapshot: string) {
  runCurrentCode('run', codeSnapshot);
}

function handleShellFrameWindow(shellWindow: Window | null) {
  shellFrameWindow.value = shellWindow;
}

function handleShellMessage(event: MessageEvent) {
  if (shellFrameWindow.value && event.source !== shellFrameWindow.value) {
    return;
  }

  const message = parseTutorialShellMessage(event.data);

  if (!message) {
    return;
  }

  if (message.payload.runVersion !== runSnapshot.value.runVersion) {
    return;
  }

  if (message.payload.lessonId !== runSnapshot.value.lessonId) {
    return;
  }

  if (message.type === 'run-success') {
    executionStatus.value = 'success';
    executionError.value = null;
    executionMessage.value = getSuccessMessage(message.payload.lessonId);
  }

  if (message.type === 'run-error') {
    executionStatus.value = 'error';
    executionError.value = message.payload.error;
    executionMessage.value = `${activeLesson.value.title} run failed in the hidden extension runtime.`;
  }
}

function handleShellChannelRegistration(event: MessageEvent) {
  if (shellFrameWindow.value && event.source !== shellFrameWindow.value) {
    return;
  }

  if (typeof event.data !== 'string') {
    return;
  }

  let parsedMessage: { _type?: string; _callbackId?: string } | null = null;

  try {
    parsedMessage = JSON.parse(event.data) as { _type?: string; _callbackId?: string };
  } catch {
    return;
  }

  if (parsedMessage?._type !== '__registerWindow__' || !parsedMessage._callbackId) {
    return;
  }

  if (!event.source || event.source === window) {
    return;
  }

  (event.source as Window).postMessage(
    JSON.stringify({
      _type: '__registerWindow__',
      _response: null,
      _callbackId: parsedMessage._callbackId,
    }),
    event.origin,
  );
}

onMounted(() => {
  window.addEventListener('message', handleShellMessage);
  window.addEventListener('message', handleShellChannelRegistration);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleShellMessage);
  window.removeEventListener('message', handleShellChannelRegistration);
});

runCurrentCode('lesson-change', currentCode.value);
</script>

<template>
  <main class="app-shell">
    <TutorialTopbar
      :lessons="lessons"
      :active-lesson-id="activeLessonId"
      @select-lesson="handleLessonSelect"
    />

    <div class="app-shell__workspace">
      <TutorialWorkspace
        :lesson="activeLesson"
        :code="currentCode"
        :editor-reset-version="editorResetVersion"
        :run-snapshot="runSnapshot"
        :execution-message="executionMessage"
        :execution-error="executionError"
        :execution-status="executionStatus"
        :last-action-label="lastActionLabel"
        @shell-frame-window="handleShellFrameWindow"
        @update-code="handleCodeUpdate"
        @reset-code="handleCodeReset"
        @run-code="handleRunCode"
      />
    </div>
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
  gap: 20px;
  padding: 20px;
}

.app-shell__workspace {
  min-width: 0;
}

@media (max-width: 720px) {
  .app-shell {
    gap: 12px;
    padding: 12px;
  }
}
</style>
