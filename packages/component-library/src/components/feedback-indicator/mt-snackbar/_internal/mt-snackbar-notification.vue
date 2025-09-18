<template>
  <div
    ref="snackbarEl"
    class="mt-snackbar-notification"
    :class="classes"
    :role="role"
    :aria-live="ariaLive"
    tabindex="0"
    :data-mounted="mounted"
    :data-removed="removed"
    :style="{
      '--offset': `${removed ? offsetBeforeRemove : offset}px`,
    }"
  >
    <div class="mt-snackbar-notification__content">
      <div class="mt-snackbar-notification__text-content">
        <div
          v-if="icon || snackbar.variant === 'progress'"
          class="mt-snackbar-notification__symbol-container"
        >
          <mt-loader v-if="isUploading" class="mt-snackbar-notification__loader" size="16px" />
          <mt-icon
            v-else-if="icon"
            class="mt-snackbar-notification__icon"
            :name="icon"
            size="16px"
          />
        </div>

        <mt-text
          class="mt-snackbar-notification__message"
          color="color-text-primary-default"
          weight="medium"
          size="xs"
        >
          {{ displayMessage }}
        </mt-text>
        <div v-if="isUploading" class="mt-snackbar-notification__progress">
          <span>{{ progressPercentage }}</span>
        </div>
      </div>
      <mt-link
        v-if="snackbar.link"
        class="mt-snackbar-notification__link"
        as="a"
        variant="primary"
        :to="snackbar.link.url"
      >
        {{ snackbar.link.text }}
      </mt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtLink from "@/components/navigation/mt-link/mt-link.vue";
import MtLoader from "@/components/feedback-indicator/mt-loader/mt-loader.vue";
import { toRefs, type PropType, computed, watch, ref, onBeforeUnmount, onMounted } from "vue";
import type { Snackbar } from "../composables/use-snackbar";
import type { HeightT } from "../mt-snackbar.vue";

const emit = defineEmits<{
  (e: "remove-snackbar", snackbar: Snackbar): void;
  (e: "update:height", height: HeightT): void;
}>();

const props = defineProps({
  snackbar: {
    type: Object as PropType<Snackbar>,
    required: true,
  },
  isHovered: {
    type: Boolean,
    default: false,
  },
  heights: {
    type: Array as PropType<HeightT[]>,
    default: () => [],
  },
});

const mounted = ref(false);
const removed = ref(false);
const offsetBeforeRemove = ref(0);

const classes = computed(() => {
  return {
    "mt-snackbar-notification--success":
      snackbar.value.variant === "success" || isUploadComplete.value,
    "mt-snackbar-notification--error": snackbar.value.variant === "error" || isUploadError.value,
    "mt-snackbar-notification--progress": snackbar.value.variant === "progress",
  };
});

const heightIndex = computed(() => {
  // Find the position of this snackbar in the heights array
  const index = props.heights.findIndex((height) => height.snackbarId === props.snackbar.id);
  return index >= 0 ? index : 0;
});

const toastsHeightBefore = computed(() => {
  // Calculate the total height of all snackbars that appear above this snackbar
  return props.heights.reduce((prev, curr, reducerIndex) => {
    // Calculate offset up until current snackbar
    if (reducerIndex >= heightIndex.value) {
      return prev;
    }

    return prev + curr.height;
  }, 0);
});

const offset = computed(() => heightIndex.value * 16 + toastsHeightBefore.value || 0);

const progressPercentage = computed(() => {
  return `(${snackbar.value.progressPercentage || 0}%)`;
});

const isUploadComplete = computed(() => {
  return snackbar.value.variant === "progress" && snackbar.value.uploadState === "success";
});

const isUploadError = computed(() => {
  return snackbar.value.variant === "progress" && snackbar.value.uploadState === "error";
});

const isUploading = computed(() => {
  return snackbar.value.variant === "progress" && !snackbar.value.uploadState;
});

const displayMessage = computed(() => {
  if (isUploadComplete.value) {
    return snackbar.value.successMessage || "Upload completed";
  }
  if (isUploadError.value) {
    return snackbar.value.errorMessage || "Upload failed";
  }
  return snackbar.value.message;
});

const icon = computed(() => {
  switch (snackbar.value.variant) {
    case "error":
      return "solid-exclamation-circle";
    case "success":
      return "solid-check-circle";
    case "progress":
      if (isUploadComplete.value) {
        return "solid-check-circle";
      }
      if (isUploadError.value) {
        return "solid-exclamation-circle";
      }
      return undefined;
    default:
      return undefined;
  }
});

const role = computed(() => {
  switch (snackbar.value.variant) {
    case "error":
      return "alert";
    case "success":
      return "log";
    default:
      return "log";
  }
});

const ariaLive = computed(() => {
  switch (snackbar.value.variant) {
    case "error":
    case "warning":
      return "assertive";
    case "success":
    case "progress":
    default:
      return "polite";
  }
});

const { snackbar, isHovered } = toRefs(props);
const snackbarEl = ref<HTMLElement | null>(null);
const timeoutId = ref<number | undefined>(undefined);
const successTimeoutId = ref<number | undefined>(undefined);
const remainingTimeOut = ref(snackbar.value.duration || 5000);
const pausedAt = ref<number | null>(null);
const isPaused = ref(false);
const successPausedAt = ref<number | null>(null);
const isSuccessPaused = ref(false);

watch(mounted, () => {
  // If the snackbar is not mounted or the snackbar element is not found
  if (!mounted.value || !snackbarEl.value) return;

  const snackbarNode = snackbarEl.value;
  const originalHeight = snackbarNode.style.height;
  snackbarNode.style.height = "auto";
  const newHeight = snackbarNode.getBoundingClientRect().height;
  snackbarNode.style.height = originalHeight as string;

  // Update the height of the snackbar
  emit("update:height", {
    snackbarId: props.snackbar.id,
    height: newHeight,
  });
});

watch(isHovered, (newIsHovered) => {
  // If the snackbar is hovered, pause the timer
  if (newIsHovered) {
    pauseTimer();
    pauseSuccessTimer();
  } else {
    resumeTimer();
    resumeSuccessTimer();
  }
});

watch(
  () => snackbar.value.duration,
  (newDuration) => {
    // Progress snackbars have their own timer
    if (snackbar.value.variant === "progress") {
      return;
    }

    // Stop timer
    if (newDuration === 0) {
      if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
        timeoutId.value = undefined;
        remainingTimeOut.value = newDuration || 5000;
      }
      return;
    }

    // Start timer only if not paused
    if (!isPaused.value) {
      timeoutId.value = window.setTimeout(() => {
        onRemoveSnackbar();
      }, remainingTimeOut.value);
    }
  },
  { immediate: true },
);

watch(
  () => snackbar.value.uploadState,
  (newUploadState) => {
    if (
      snackbar.value.variant === "progress" &&
      (newUploadState === "success" || newUploadState === "error")
    ) {
      // Start success timer only if not paused
      if (!isSuccessPaused.value) {
        successTimeoutId.value = window.setTimeout(() => {
          onRemoveSnackbar();
        }, 2000);
      }
    }
  },
);

function pauseTimer() {
  // If the timer is not paused, pause it
  if (timeoutId.value && !isPaused.value) {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = undefined;
    pausedAt.value = Date.now();
    isPaused.value = true;
  }
}

function resumeTimer() {
  // If the timer is paused, resume it
  if (isPaused.value && pausedAt.value) {
    const elapsed = Date.now() - pausedAt.value;
    const newRemainingTime = Math.max(0, remainingTimeOut.value - elapsed);
    remainingTimeOut.value = newRemainingTime;

    if (newRemainingTime > 0) {
      timeoutId.value = window.setTimeout(() => {
        onRemoveSnackbar();
      }, newRemainingTime);
    } else {
      onRemoveSnackbar();
    }

    pausedAt.value = null;
    isPaused.value = false;
  }
}

function pauseSuccessTimer() {
  // If the success timer is not paused, pause it
  if (successTimeoutId.value && !isSuccessPaused.value) {
    window.clearTimeout(successTimeoutId.value);
    successTimeoutId.value = undefined;
    successPausedAt.value = Date.now();
    isSuccessPaused.value = true;
  }
}

function resumeSuccessTimer() {
  // If the success timer is paused, resume it
  if (isSuccessPaused.value && successPausedAt.value) {
    const elapsed = Date.now() - successPausedAt.value;
    const newRemainingTime = Math.max(0, 2000 - elapsed);

    // If the success timer has remaining time, resume it
    if (newRemainingTime > 0) {
      successTimeoutId.value = window.setTimeout(() => {
        onRemoveSnackbar();
      }, newRemainingTime);
    } else {
      onRemoveSnackbar();
    }

    successPausedAt.value = null;
    isSuccessPaused.value = false;
  }
}

function onRemoveSnackbar() {
  removed.value = true;
  // Set the offset before the snackbar is removed
  offsetBeforeRemove.value = offset.value;

  // Remove the snackbar after the animation duration
  setTimeout(() => {
    emit("remove-snackbar", props.snackbar);
  }, 500); // Match the CSS animation duration
}

onMounted(() => {
  mounted.value = true;

  // If the snackbar element is found then focus it
  if (snackbarEl.value) {
    snackbarEl.value.focus();
  }
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    window.clearTimeout(timeoutId.value);
  }
  if (successTimeoutId.value) {
    window.clearTimeout(successTimeoutId.value);
  }
  // Reset pause states
  isPaused.value = false;
  isSuccessPaused.value = false;
  pausedAt.value = null;
  successPausedAt.value = null;
});
</script>

<style scoped>
.mt-snackbar-notification {
  max-width: 360px;
  width: fit-content;
  padding: var(--scale-size-12);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  pointer-events: auto;
  background: var(--color-elevation-surface-raised);
  box-shadow: 0px 8px 20px 0px var(--color-elevation-shadow-default);
}

.mt-snackbar-notification__content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--scale-size-12);
  align-items: center;
}

.mt-snackbar-notification__text-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.mt-snackbar-notification__link {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.mt-snackbar-notification__icon {
  margin-bottom: 2px; /* Fix icon alignment */
}

.mt-snackbar-notification__message {
  word-wrap: break-word;
}

.mt-snackbar-notification--success {
  .mt-snackbar-notification__icon {
    color: var(--color-icon-positive-default);
  }
}

.mt-snackbar-notification--error {
  .mt-snackbar-notification__icon {
    color: var(--color-icon-critical-default);
  }
}

.mt-snackbar-notification__symbol-container {
  flex-shrink: 0;
  margin-right: var(--scale-size-8);

  .mt-snackbar-notification__loader {
    position: relative;
    background: none;
    width: 18px;
    height: 18px;
  }
}

.mt-snackbar-notification__progress {
  width: var(--scale-size-48);
  margin-left: var(--scale-size-6);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}
</style>
