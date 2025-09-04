<template>
  <Teleport to="body">
    <div class="mt-snackbar" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <mt-snackbar-notification
        v-for="(snackbar, index) in snackbars"
        :key="snackbar.id"
        :ref="(el) => setNotificationRef(el, index)"
        :snackbar="snackbar"
        :is-hovered="isHovered"
        @remove-snackbar="removeSnackbar"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MtSnackbarNotification from "./_internal/mt-snackbar-notification.vue";
import { useSnackbar } from "./composables/use-snackbar";
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from "vue";

const { snackbars, removeSnackbar } = useSnackbar();

// Store references to snackbar notifications to calculate heights
const notificationRefs = ref<(HTMLElement | null)[]>([]);

// Hover state for pausing timers
const isHovered = ref(false);

function onMouseEnter() {
  isHovered.value = true;
}

function onMouseLeave() {
  isHovered.value = false;
}

// Observer to handle dynamic height changes
let resizeObserver: ResizeObserver | null = null;

function setNotificationRef(el: any, index: number) {
  if (el && el.$el) {
    notificationRefs.value[index] = el.$el;
  } else if (el && el.offsetHeight) {
    notificationRefs.value[index] = el;
  }

  // Observe the new notification for size changes
  if (resizeObserver && el) {
    const elementToObserve = el.$el || el;
    resizeObserver.observe(elementToObserve);
  }
}

function calculateNotificationPosition(index: number): number {
  let totalHeight = 0;

  // Sum up the heights of all previous notifications plus gaps
  for (let i = 0; i < index; i++) {
    const ref = notificationRefs.value[i];
    if (ref) {
      totalHeight += ref.offsetHeight + 16;
    }
  }

  return totalHeight;
}

// Update positions when snackbars change
watch(
  snackbars,
  async () => {
    await nextTick();
    notificationRefs.value = notificationRefs.value.slice(0, snackbars.value.length);
    updateNotificationPositions();
  },
  { deep: true },
);

function updateNotificationPositions() {
  notificationRefs.value.forEach((ref, index) => {
    if (ref) {
      const yOffset = calculateNotificationPosition(index);
      ref.style.setProperty("--y-offset", `${yOffset}px`);
    }
  });
}

nextTick(() => {
  updateNotificationPositions();
});

// Observe snackbar notifications for size changes
onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      updateNotificationPositions();
    });
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.mt-snackbar {
  width: 360px;
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  pointer-events: none;
  height: 400px;
  overflow: visible;
}

.mt-snackbar :deep(.mt-snackbar-notification) {
  position: absolute;
  bottom: 0;
  right: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  z-index: 1;
}

/* Position snackbar based on height */
.mt-snackbar :deep(.mt-snackbar-notification) {
  transform: translateY(calc(-1 * var(--y-offset, 0px)));
  opacity: 1;
}

.mt-snackbar :deep(.mt-snackbar-notification) {
  animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%) translateY(calc(-1 * var(--y-offset, 0px)));
    opacity: 0;
  }
  100% {
    transform: translateX(0) translateY(calc(-1 * var(--y-offset, 0px)));
    opacity: 1;
  }
}

.mt-snackbar :deep(.mt-snackbar-notification.leaving) {
  animation: slideOutDown 0.5s cubic-bezier(0.66, 0, 0.34, 1) forwards;
}

@keyframes slideOutDown {
  0% {
    transform: translateX(0) translateY(calc(-1 * var(--y-offset, 0px)));
    opacity: 1;
    z-index: 1;
  }
  75% {
    opacity: 0;
    z-index: -1;
  }
  100% {
    transform: translateX(0) translateY(calc(-1 * var(--y-offset, 0px) + 64px));
    opacity: 0;
    z-index: -1;
  }
}
</style>
