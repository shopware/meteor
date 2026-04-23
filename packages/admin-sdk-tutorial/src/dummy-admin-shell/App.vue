<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import DummyAdminShell from '@/components/DummyAdminShell.vue';
import { registerTutorialHostHandlers } from '@/host/registerTutorialHostHandlers';
import { createTutorialHostRuntime } from '@/host/tutorialHost';
import { lessons } from '@/lessons/lessons';
import { createRuntimeState, resetRuntimeState } from '@/runtime/createRuntimeState';
import type { TutorialRuntimeState } from '@/types/runtime';
import { parseTutorialParentMessage, type TutorialRunSnapshot } from '@/types/tutorialShell';

const params = new URLSearchParams(window.location.search);
const initialLesson =
  lessons.find((lesson) => lesson.id === params.get('lesson-id')) ?? lessons[0];

function cloneRuntimeState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const SUCCESSFUL_RUNTIME_STATES_STORAGE_KEY = 'meteor-admin-sdk-tutorial:successful-runtime-states';

function readSuccessfulRuntimeStates() {
  const storedValue = window.sessionStorage.getItem(SUCCESSFUL_RUNTIME_STATES_STORAGE_KEY);

  if (!storedValue) {
    return {} as Record<string, TutorialRuntimeState>;
  }

  try {
    return JSON.parse(storedValue) as Record<string, TutorialRuntimeState>;
  } catch {
    return {} as Record<string, TutorialRuntimeState>;
  }
}

function writeSuccessfulRuntimeStates(value: Record<string, TutorialRuntimeState>) {
  window.sessionStorage.setItem(SUCCESSFUL_RUNTIME_STATES_STORAGE_KEY, JSON.stringify(value));
}

const runSnapshot = ref<TutorialRunSnapshot | null>(null);
const runtimeState = ref(createRuntimeState(initialLesson));
const hiddenRuntimeFrame = ref<HTMLIFrameElement | null>(null);
const acceptHostMessages = ref(false);
const successfulRuntimeStates = ref<Record<string, TutorialRuntimeState>>(readSuccessfulRuntimeStates());

const hostRuntime = createTutorialHostRuntime({
  getAllowedSource: () => null,
});

let stopTutorialHostHandlers = () => {};

const activeLesson = computed(
  () => lessons.find((lesson) => lesson.id === runSnapshot.value?.lessonId) ?? initialLesson,
);

const hiddenRuntimeSrc = computed(
  () => {
    if (!runSnapshot.value) {
      return '';
    }

    return `/iframe-runtime.html?lesson-id=${runSnapshot.value.lessonId}&location-id=${runSnapshot.value.runtimeLocationId}&run-version=${runSnapshot.value.runVersion}`;
  },
);

function syncHiddenRuntimeFrame() {
  if (!runSnapshot.value) {
    return;
  }

  hiddenRuntimeFrame.value?.contentWindow?.postMessage(
    {
      source: 'tutorial-host',
      type: 'tutorial:set-code',
      lessonId: runSnapshot.value.lessonId,
      locationId: runSnapshot.value.runtimeLocationId,
      code: runSnapshot.value.code,
      runCode: runSnapshot.value.runCode,
      runVersion: runSnapshot.value.runVersion,
    },
    '*',
  );
}

function resetShellState(nextSnapshot: TutorialRunSnapshot) {
  const nextLesson = lessons.find((lesson) => lesson.id === nextSnapshot.lessonId) ?? initialLesson;

  runSnapshot.value = nextSnapshot;
  runtimeState.value = cloneRuntimeState(resetRuntimeState(nextLesson));
  acceptHostMessages.value = true;
}

function getLastSuccessfulRuntimeState(lessonId: string) {
  return successfulRuntimeStates.value[lessonId]
    ? cloneRuntimeState(successfulRuntimeStates.value[lessonId])
    : cloneRuntimeState(resetRuntimeState(lessons.find((lesson) => lesson.id === lessonId) ?? initialLesson));
}

function persistSuccessfulRuntimeState(lessonId: string) {
  successfulRuntimeStates.value[lessonId] = cloneRuntimeState(runtimeState.value);
  writeSuccessfulRuntimeStates(successfulRuntimeStates.value);
}

function postShellEvent(payload: unknown) {
  window.parent.postMessage(JSON.stringify(payload), '*');
}

function handleParentMessage(event: MessageEvent) {
  const message = parseTutorialParentMessage(event.data);

  if (!message) {
    return;
  }

  resetShellState(message.payload);
}

function handleTutorialRuntimeEvent(event: MessageEvent) {
  if (typeof event.data !== 'object' || event.data?.source !== 'tutorial-iframe') {
    return;
  }

  if (!runSnapshot.value) {
    return;
  }

  if (event.source !== hiddenRuntimeFrame.value?.contentWindow) {
    return;
  }

  if (event.data.type === 'run-success') {
    postShellEvent({
      source: 'tutorial-shell',
      type: 'run-success',
      payload: {
        lessonId: event.data.lessonId,
        runVersion: event.data.runVersion,
      },
    });
  }

  if (event.data.type === 'run-error') {
    runtimeState.value = getLastSuccessfulRuntimeState(activeLesson.value.id);
    acceptHostMessages.value = false;

    postShellEvent({
      source: 'tutorial-shell',
      type: 'run-error',
      payload: {
        lessonId: event.data.lessonId,
        runVersion: event.data.runVersion,
        error: event.data.error,
      },
    });
  }
}

watch(
  () => runSnapshot.value,
  () => {
    if (!runSnapshot.value) {
      return;
    }

    syncHiddenRuntimeFrame();
  },
  {
    deep: true,
  },
);

onMounted(() => {
  hostRuntime.start();
  stopTutorialHostHandlers = registerTutorialHostHandlers({
    onNotification: (payload) => {
      if (!acceptHostMessages.value) {
        return;
      }

      runtimeState.value.notificationTitle = payload.title;
      runtimeState.value.notificationMessage = payload.message;
      runtimeState.value.notificationTone = payload.variant ?? 'info';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real Admin SDK notification request was received and rendered by the dummy host shell.';
      runtimeState.value.statusLabel = 'Notification concept';
      persistSuccessfulRuntimeState(activeLesson.value.id);
    },
    onMenuItem: (payload) => {
      if (!acceptHostMessages.value) {
        return;
      }

      const nextMenuItem = {
        id: `dynamic-${payload.locationId}`,
        label: payload.label,
        kind: 'dynamic' as const,
        position: payload.position,
      };

      runtimeState.value.menuItems = [
        ...runtimeState.value.menuItems.filter((item) => item.kind === 'static'),
        nextMenuItem,
      ].sort((left, right) => (left.position ?? 999) - (right.position ?? 999));
      runtimeState.value.notificationTitle = 'Menu item added';
      runtimeState.value.notificationMessage = `The host received a real menu registration for ${payload.locationId}.`;
      runtimeState.value.notificationTone = 'success';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real Admin SDK menu item request was received and rendered by the dummy host shell.';
      runtimeState.value.statusLabel = 'Navigation concept';
      persistSuccessfulRuntimeState(activeLesson.value.id);
    },
    onComponentSection: (payload) => {
      if (!acceptHostMessages.value) {
        return;
      }

      runtimeState.value.surfaces = runtimeState.value.surfaces.map((surface) => {
        if (surface.id !== payload.positionId) {
          return {
            ...surface,
            runtimeLocationId:
              surface.runtimeLocationId && surface.runtimeLocationId !== payload.props.locationId
                ? undefined
                : surface.runtimeLocationId,
          };
        }

        return {
          ...surface,
          title: payload.props.title ?? payload.props.locationId,
          description: payload.props.subtitle ?? `Position: ${payload.positionId}`,
          slotLabel: 'Host slot',
          runtimeLocationId: payload.props.locationId,
          runtimeHeight: 180,
          variant: 'default' as const,
        };
      });
      runtimeState.value.notificationTitle = 'Location registered';
      runtimeState.value.notificationMessage = `The host registered ${payload.props.locationId} at ${payload.positionId}.`;
      runtimeState.value.notificationTone = 'success';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real component-section registration created a visible location iframe in the chosen host slot.';
      runtimeState.value.statusLabel = 'Extension surfaces concept';
      persistSuccessfulRuntimeState(activeLesson.value.id);
    },
    onLocationHeight: (payload) => {
      if (!acceptHostMessages.value) {
        return;
      }

      if (!payload.locationId) {
        return;
      }

      runtimeState.value.surfaces = runtimeState.value.surfaces.map((surface) => {
        if (surface.runtimeLocationId !== payload.locationId) {
          return surface;
        }

        return {
          ...surface,
          runtimeHeight: Math.max(140, Math.min(payload.height, 320)),
        };
      });
      persistSuccessfulRuntimeState(activeLesson.value.id);
    },
  });

  window.addEventListener('message', handleParentMessage);
  window.addEventListener('message', handleTutorialRuntimeEvent);
});

onBeforeUnmount(() => {
  hostRuntime.stop();
  stopTutorialHostHandlers();
  window.removeEventListener('message', handleParentMessage);
  window.removeEventListener('message', handleTutorialRuntimeEvent);
});
</script>

<template>
  <main class="dummy-admin-shell-app">
    <template v-if="runSnapshot">
      <iframe
        ref="hiddenRuntimeFrame"
        class="dummy-admin-shell-app__hidden-runtime"
        :src="hiddenRuntimeSrc"
        title="Hidden extension runtime"
        tabindex="-1"
        aria-hidden="true"
        @load="syncHiddenRuntimeFrame"
      />

      <DummyAdminShell
        :runtime-state="runtimeState"
        :lesson-id="runSnapshot.lessonId"
        :code="runSnapshot.code"
        :run-code="runSnapshot.runCode"
        :run-version="runSnapshot.runVersion"
      />
    </template>
    <div v-else class="dummy-admin-shell-app__loading">Loading preview…</div>
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
}

.dummy-admin-shell-app {
  min-height: 100vh;
  padding: 14px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.dummy-admin-shell-app__hidden-runtime {
  position: absolute;
  width: 0;
  height: 0;
  border: 0;
  opacity: 0;
  pointer-events: none;
}

.dummy-admin-shell-app__loading {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 28px);
  border: 1px solid #d8e0eb;
  border-radius: 18px;
  background: #ffffff;
  color: #64748b;
  font-weight: 600;
}
</style>
