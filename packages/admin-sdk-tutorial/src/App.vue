<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import TutorialSidebar from '@/components/TutorialSidebar.vue';
import TutorialWorkspace from '@/components/TutorialWorkspace.vue';
import { registerTutorialHostHandlers } from '@/host/registerTutorialHostHandlers';
import { createTutorialHostRuntime } from '@/host/tutorialHost';
import { lessons } from '@/lessons/lessons';
import { createRuntimeState, resetRuntimeState } from '@/runtime/createRuntimeState';

const activeLessonId = ref(lessons[0]?.id ?? '');
const currentCode = ref(lessons[0]?.starterCode ?? '');
const iframeRunCode = ref(lessons[0]?.starterCode ?? '');
const editorResetVersion = ref(0);
const previewResetVersion = ref(0);
const executionMessage = ref('Ready to execute starter code.');
const executionError = ref<string | null>(null);
const executionStatus = ref<'idle' | 'success' | 'error'>('idle');
const lastActionLabel = ref('Not run yet');
const runtimeFrameWindow = ref<Window | null>(null);

const activeLesson = computed(
  () => lessons.find((lesson) => lesson.id === activeLessonId.value) ?? lessons[0],
);

function cloneRuntimeState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const runtimeState = ref(createRuntimeState(activeLesson.value));
const lastSuccessfulRuntimeState = ref(cloneRuntimeState(runtimeState.value));
const lastSuccessfulNotificationState = ref(cloneRuntimeState(runtimeState.value));
const expectedNotificationPayload = ref<{
  title: string;
  message: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
} | null>(null);
const latestNotificationIntentRunVersion = ref(0);
const expectedMenuPayload = ref<{
  label: string;
  locationId: string;
  parent?: string;
  position?: number;
} | null>(null);
const latestMenuIntentRunVersion = ref(0);
const expectedComponentSectionPayload = ref<{
  component: string;
  positionId: string;
  props: {
    locationId: string;
    title?: string;
    subtitle?: string;
  };
} | null>(null);
const latestComponentSectionRunVersion = ref(0);
const failedIframeRunVersion = ref(0);
const lastSuccessfulNotificationPayload = ref<{
  title: string;
  message: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
} | null>(null);
const hostRuntime = createTutorialHostRuntime({
  getAllowedSource: () => runtimeFrameWindow.value,
});
let stopTutorialHostHandlers = () => {};

function getSuccessMessage() {
  if (activeLesson.value.id === 'notifications') {
    return 'Success: the real notification API updated the host toast preview.';
  }

  if (activeLesson.value.id === 'menu-items') {
    return 'Success: the real menu API updated the dummy admin navigation.';
  }

  return 'Success: the real location registration opened the matching host slot.';
}

function getResetMessage() {
  return `Starter code restored and re-run for ${activeLesson.value.title}.`;
}

function parseMenuPayloadFromCode(code: string) {
  const labelMatches = [...code.matchAll(/label:\s*'([^']+)'/g)];
  const locationMatches = [...code.matchAll(/locationId:\s*'([^']+)'/g)];
  const positionMatches = [...code.matchAll(/position:\s*(\d+)/g)];
  const parentMatches = [...code.matchAll(/parent:\s*'([^']+)'/g)];

  const label = labelMatches[labelMatches.length - 1]?.[1];
  const locationId = locationMatches[locationMatches.length - 1]?.[1];
  const positionMatch = positionMatches[positionMatches.length - 1]?.[1];
  const parent = parentMatches[parentMatches.length - 1]?.[1];

  if (!label || !locationId) {
    return null;
  }

  return {
    label,
    locationId,
    parent,
    position: positionMatch ? Number(positionMatch) : undefined,
  };
}

function runCurrentCode(
  source: 'run' | 'reset' | 'lesson-change' = 'run',
  codeSnapshot?: string,
) {
  const nextCode = codeSnapshot ?? currentCode.value;

  currentCode.value = nextCode;
  failedIframeRunVersion.value = 0;

  if (activeLesson.value.id === 'notifications') {
    iframeRunCode.value = nextCode;
    previewResetVersion.value += 1;
    runtimeState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
    executionError.value = null;
    executionStatus.value = 'idle';
    executionMessage.value = 'Running real Admin SDK notification code inside the lesson iframe…';
    lastActionLabel.value =
      source === 'reset'
        ? `Reset + run ${previewResetVersion.value}`
        : source === 'lesson-change'
          ? `Lesson load ${previewResetVersion.value}`
          : `Run ${previewResetVersion.value}`;
    return;
  }

  if (activeLesson.value.id === 'locations-positions') {
    iframeRunCode.value = nextCode;
    previewResetVersion.value += 1;
    runtimeState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
    executionError.value = null;
    executionStatus.value = 'idle';
    executionMessage.value = 'Running real location registration code inside the lesson iframe…';
    lastActionLabel.value =
      source === 'reset'
        ? `Reset + run ${previewResetVersion.value}`
        : source === 'lesson-change'
          ? `Lesson load ${previewResetVersion.value}`
          : `Run ${previewResetVersion.value}`;
    return;
  }

  if (activeLesson.value.id === 'menu-items') {
    expectedMenuPayload.value = parseMenuPayloadFromCode(nextCode);
    iframeRunCode.value = nextCode;
    previewResetVersion.value += 1;
    runtimeState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
    executionError.value = null;
    executionStatus.value = 'idle';
    executionMessage.value = 'Running real Admin SDK menu code inside the lesson iframe…';
    lastActionLabel.value =
      source === 'reset'
        ? `Reset + run ${previewResetVersion.value}`
        : source === 'lesson-change'
          ? `Lesson load ${previewResetVersion.value}`
          : `Run ${previewResetVersion.value}`;
    return;
  }
}

watch(activeLessonId, () => {
  currentCode.value = activeLesson.value.starterCode;
  editorResetVersion.value += 1;
  lastSuccessfulRuntimeState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
  lastSuccessfulNotificationState.value = cloneRuntimeState(resetRuntimeState(activeLesson.value));
  expectedNotificationPayload.value = null;
  latestNotificationIntentRunVersion.value = 0;
  expectedMenuPayload.value = null;
  latestMenuIntentRunVersion.value = 0;
  expectedComponentSectionPayload.value = null;
  latestComponentSectionRunVersion.value = 0;
  lastSuccessfulNotificationPayload.value = null;
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
  runCurrentCode('reset', activeLesson.value.starterCode);
}

function handleRunCode(codeSnapshot: string) {
  runCurrentCode('run', codeSnapshot);
}

function handleRuntimeFrameWindow(runtimeWindow: Window | null) {
  runtimeFrameWindow.value = runtimeWindow;
  hostRuntime.syncRegisteredSourceCount();
}

function handleTutorialRuntimeEvent(event: MessageEvent) {
  if (typeof event.data !== 'object' || event.data?.source !== 'tutorial-iframe') {
    return;
  }

  if (event.data.type === 'run-success' && event.data.lessonId === 'notifications') {
    if ((event.data.runVersion ?? 0) === failedIframeRunVersion.value) {
      return;
    }

    lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
    lastSuccessfulNotificationState.value = cloneRuntimeState(runtimeState.value);
    if (expectedNotificationPayload.value) {
      latestNotificationIntentRunVersion.value = Math.max(
        latestNotificationIntentRunVersion.value,
        event.data.runVersion ?? 0,
      );
      lastSuccessfulNotificationPayload.value = { ...expectedNotificationPayload.value };
    }
    executionStatus.value = 'success';
    executionError.value = null;
    executionMessage.value = getSuccessMessage();
  }

  if (event.data.type === 'run-success' && event.data.lessonId === 'menu-items') {
    if ((event.data.runVersion ?? 0) === failedIframeRunVersion.value) {
      return;
    }

    if (expectedMenuPayload.value) {
      const nextMenuItem = {
        id: `dynamic-${expectedMenuPayload.value.locationId}`,
        label: expectedMenuPayload.value.label,
        kind: 'dynamic' as const,
        position: expectedMenuPayload.value.position,
      };

      runtimeState.value.menuItems = [
        ...runtimeState.value.menuItems.filter((item) => item.kind === 'static'),
        nextMenuItem,
      ].sort((left, right) => (left.position ?? 999) - (right.position ?? 999));
      runtimeState.value.notificationTitle = 'Menu item added';
      runtimeState.value.notificationMessage = `The host received a real menu registration for ${expectedMenuPayload.value.locationId}.`;
      runtimeState.value.notificationTone = 'success';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real Admin SDK menu item request was received and rendered by the dummy host.';
      runtimeState.value.statusLabel = 'Navigation concept';
    }

    lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
    executionStatus.value = 'success';
    executionError.value = null;
    executionMessage.value = getSuccessMessage();
  }

  if (event.data.type === 'run-success' && event.data.lessonId === 'locations-positions') {
    if ((event.data.runVersion ?? 0) === failedIframeRunVersion.value) {
      return;
    }

    lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
    executionStatus.value = 'success';
    executionError.value = null;
    executionMessage.value = getSuccessMessage();
  }

  if (event.data.type === 'notification-intent' && event.data.lessonId === 'notifications') {
    if ((event.data.runVersion ?? 0) < latestNotificationIntentRunVersion.value) {
      return;
    }

    latestNotificationIntentRunVersion.value = event.data.runVersion ?? latestNotificationIntentRunVersion.value;
    expectedNotificationPayload.value = {
      title: event.data.payload.title,
      message: event.data.payload.message,
      variant: event.data.payload.variant,
    };
  }

  if (event.data.type === 'menu-intent' && event.data.lessonId === 'menu-items') {
    if ((event.data.runVersion ?? 0) < latestMenuIntentRunVersion.value) {
      return;
    }

    if (
      (event.data.runVersion ?? 0) === latestMenuIntentRunVersion.value &&
      expectedMenuPayload.value
    ) {
      return;
    }

    latestMenuIntentRunVersion.value = event.data.runVersion ?? latestMenuIntentRunVersion.value;
    expectedMenuPayload.value = {
      label: event.data.payload.label,
      locationId: event.data.payload.locationId,
      parent: event.data.payload.parent,
      position: event.data.payload.position,
    };
  }

  if (event.data.type === 'component-section-intent' && event.data.lessonId === 'locations-positions') {
    if ((event.data.runVersion ?? 0) < latestComponentSectionRunVersion.value) {
      return;
    }

    if (
      (event.data.runVersion ?? 0) === latestComponentSectionRunVersion.value &&
      expectedComponentSectionPayload.value
    ) {
      return;
    }

    latestComponentSectionRunVersion.value =
      event.data.runVersion ?? latestComponentSectionRunVersion.value;
    expectedComponentSectionPayload.value = {
      component: event.data.payload.component,
      positionId: event.data.payload.positionId,
      props: {
        locationId: event.data.payload.props.locationId,
        title: event.data.payload.props.title,
        subtitle: event.data.payload.props.subtitle,
      },
    };
  }

  if (event.data.type === 'run-error' && event.data.lessonId === 'notifications') {
    failedIframeRunVersion.value = event.data.runVersion ?? failedIframeRunVersion.value;
    if (lastSuccessfulNotificationPayload.value) {
      runtimeState.value.notificationTitle = lastSuccessfulNotificationPayload.value.title;
      runtimeState.value.notificationMessage = lastSuccessfulNotificationPayload.value.message;
      runtimeState.value.notificationTone = lastSuccessfulNotificationPayload.value.variant ?? 'info';
    } else {
      runtimeState.value = cloneRuntimeState(lastSuccessfulNotificationState.value);
    }
    executionStatus.value = 'error';
    executionError.value = event.data.error;
    executionMessage.value = 'Notifications run failed in the lesson iframe.';
  }

  if (event.data.type === 'run-error' && event.data.lessonId === 'menu-items') {
    failedIframeRunVersion.value = event.data.runVersion ?? failedIframeRunVersion.value;
    runtimeState.value = cloneRuntimeState(lastSuccessfulRuntimeState.value);
    executionStatus.value = 'error';
    executionError.value = event.data.error;
    executionMessage.value = 'Menu items run failed in the lesson iframe.';
  }

  if (event.data.type === 'run-error' && event.data.lessonId === 'locations-positions') {
    failedIframeRunVersion.value = event.data.runVersion ?? failedIframeRunVersion.value;
    runtimeState.value = cloneRuntimeState(lastSuccessfulRuntimeState.value);
    executionStatus.value = 'error';
    executionError.value = event.data.error;
    executionMessage.value = 'Locations run failed in the lesson iframe.';
  }
}

onMounted(() => {
  hostRuntime.start();
  stopTutorialHostHandlers = registerTutorialHostHandlers({
    onNotification: (payload) => {
      if (
        activeLesson.value.id === 'notifications' &&
        expectedNotificationPayload.value &&
        (
          expectedNotificationPayload.value.title !== payload.title ||
          expectedNotificationPayload.value.message !== payload.message ||
          (expectedNotificationPayload.value.variant ?? 'info') !== (payload.variant ?? 'info')
        )
      ) {
        return;
      }

      runtimeState.value.notificationTitle = payload.title;
      runtimeState.value.notificationMessage = payload.message;
      runtimeState.value.notificationTone = payload.variant ?? 'info';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real Admin SDK notification request was received and rendered by the dummy host.';
      runtimeState.value.statusLabel = 'Notification concept';
      lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
      lastSuccessfulNotificationState.value = cloneRuntimeState(runtimeState.value);
    },
    onMenuItem: (payload) => {
      if (
        activeLesson.value.id === 'menu-items' &&
        expectedMenuPayload.value &&
        (
          expectedMenuPayload.value.label !== payload.label ||
          expectedMenuPayload.value.locationId !== payload.locationId ||
          (expectedMenuPayload.value.position ?? 110) !== (payload.position ?? 110)
        )
      ) {
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
        'A real Admin SDK menu item request was received and rendered by the dummy host.';
      runtimeState.value.statusLabel = 'Navigation concept';
      lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
    },
    onComponentSection: (payload) => {
      if (
        activeLesson.value.id === 'locations-positions' &&
        expectedComponentSectionPayload.value &&
        (
          expectedComponentSectionPayload.value.positionId !== payload.positionId ||
          expectedComponentSectionPayload.value.props.locationId !== payload.props.locationId
        )
      ) {
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
          variant: 'default',
        };
      });
      runtimeState.value.notificationTitle = 'Location registered';
      runtimeState.value.notificationMessage = `The host registered ${payload.props.locationId} at ${payload.positionId}.`;
      runtimeState.value.notificationTone = 'success';
      runtimeState.value.emptyStateTitle = 'What changed in the host';
      runtimeState.value.emptyStateMessage =
        'A real component-section registration created a visible location iframe in the chosen host slot.';
      runtimeState.value.statusLabel = 'Extension surfaces concept';
      lastSuccessfulRuntimeState.value = cloneRuntimeState(runtimeState.value);
    },
    onLocationHeight: (payload) => {
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
    },
  });
  window.addEventListener('message', handleTutorialRuntimeEvent);
});

onBeforeUnmount(() => {
  hostRuntime.stop();
  stopTutorialHostHandlers();
  window.removeEventListener('message', handleTutorialRuntimeEvent);
});

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
      :iframe-run-code="iframeRunCode"
      :editor-reset-version="editorResetVersion"
      :preview-reset-version="previewResetVersion"
      :runtime-state="runtimeState"
      :execution-message="executionMessage"
      :execution-error="executionError"
      :execution-status="executionStatus"
      :last-action-label="lastActionLabel"
      :iframe-status="hostRuntime.iframeStatus.value"
      :last-sdk-message-type="hostRuntime.lastSdkMessageType.value"
      :registered-source-count="hostRuntime.registeredSourceCount.value"
      :runtime-location-id="activeLesson.runtimeLocationId"
      @update-code="handleCodeUpdate"
      @reset-code="handleCodeReset"
      @run-code="handleRunCode"
      @runtime-frame-window="handleRuntimeFrameWindow"
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
