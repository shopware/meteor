<template>
  <Teleport to="body">
    <div class="mt-snackbar" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <mt-snackbar-notification
        v-for="snackbar in snackbars"
        :key="snackbar.id"
        :snackbar="snackbar"
        :is-hovered="isHovered"
        :heights="heights"
        @remove-snackbar="removeSnackbarWithHeightCleanup"
        @update:height="updateHeight"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MtSnackbarNotification from "./_internal/mt-snackbar-notification.vue";
import { useSnackbar, type Snackbar } from "./composables/use-snackbar";
import { ref } from "vue";

export interface HeightT {
  height: number;
  snackbarId: string;
}

const { snackbars, removeSnackbar } = useSnackbar();

const heights = ref<HeightT[]>([]);
const isHovered = ref(false);

function updateHeight(h: HeightT) {
  // Find the index of the snackbar in the heights array
  const index = heights.value.findIndex((item) => item.snackbarId === h.snackbarId);
  // If the snackbar is found, update its height
  if (index !== -1) {
    heights.value[index] = h;
  } else {
    // If the snackbar is not found, add it to the heights array
    heights.value.unshift(h);
  }
}

function removeSnackbarWithHeightCleanup(snackbarToRemove: Snackbar) {
  // Remove the snackbar from the snackbars array
  removeSnackbar(snackbarToRemove.id);

  // Delay cleaning heights to give animation time to complete
  setTimeout(() => {
    if (!snackbars.value.find((s) => s.id === snackbarToRemove.id)) {
      heights.value = heights.value.filter((h) => h.snackbarId !== snackbarToRemove.id);
    }
  }, 250);
}
</script>

<style scoped>
.mt-snackbar {
  width: 360px;
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  pointer-events: none;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mt-snackbar :deep(.mt-snackbar-notification) {
  --y: translateY(100%);
  --lift: -1;
  position: absolute;
  transform: var(--y);
  bottom: var(--scale-size-0);
  right: var(--scale-size-0);
  opacity: 0;
  touch-action: none;
  pointer-events: auto;
  transition:
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
    height 500ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: slideInFromRight 0.5s cubic-bezier(0.66, 0, 0.34, 1);
}

.mt-snackbar :deep(.mt-snackbar-notification[data-mounted="true"]) {
  --y: translateY(calc(var(--lift) * var(--offset)));
  opacity: 1;
}

/* Exit animation */
.mt-snackbar :deep(.mt-snackbar-notification[data-removed="true"]) {
  animation: slideOutToBottom 0.4s cubic-bezier(0.32, 0, 0.67, 0) forwards;
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%) var(--y);
    opacity: 0;
  }
  100% {
    transform: translateX(0) var(--y);
    opacity: 1;
  }
}

@keyframes slideOutToBottom {
  0% {
    transform: translateY(0) var(--y);
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  100% {
    transform: translateY(100%) var(--y);
    opacity: 0;
  }
}
</style>
