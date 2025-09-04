<template>
  <div
    ref="snackbarEl"
    class="mt-snackbar-notification"
    :class="[classes, { leaving: isLeaving }]"
    :role="role"
    :aria-live="ariaLive"
    tabindex="0"
  >
    <div class="mt-snackbar-notification__content">
      <div class="mt-snackbar-notification__text-content">
        <div
          v-if="icon || snackbar.type === 'upload'"
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

const emit = defineEmits(["remove-snackbar"]);

const props = defineProps({
  snackbar: {
    type: Object as PropType<Snackbar>,
    required: true,
  },
  isHovered: {
    type: Boolean,
    default: false,
  },
});

const isLeaving = ref(false);

const classes = computed(() => {
  return {
    "mt-snackbar-notification--success":
      snackbar.value.type === "success" || isUploadComplete.value,
    "mt-snackbar-notification--error": snackbar.value.type === "error" || isUploadError.value,
    "mt-snackbar-notification--upload": snackbar.value.type === "upload",
  };
});

const progressPercentage = computed(() => {
  return `(${snackbar.value.progressPercentage || 0}%)`;
});

const isUploadComplete = computed(() => {
  return snackbar.value.type === "upload" && snackbar.value.uploadState === "success";
});

const isUploadError = computed(() => {
  return snackbar.value.type === "upload" && snackbar.value.uploadState === "error";
});

const isUploading = computed(() => {
  return snackbar.value.type === "upload" && !snackbar.value.uploadState;
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
  switch (snackbar.value.type) {
    case "error":
      return "solid-exclamation-circle";
    case "success":
      return "solid-check-circle";
    case "upload":
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
  switch (snackbar.value.type) {
    case "error":
      return "alert";
    case "success":
      return "log";
    default:
      return "log";
  }
});

const ariaLive = computed(() => {
  switch (snackbar.value.type) {
    case "error":
    case "warning":
      return "assertive";
    case "success":
    case "upload":
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

function pauseTimer() {
  if (timeoutId.value && !isPaused.value) {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = undefined;
    pausedAt.value = Date.now();
    isPaused.value = true;
  }
}

function resumeTimer() {
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
  if (successTimeoutId.value && !isSuccessPaused.value) {
    window.clearTimeout(successTimeoutId.value);
    successTimeoutId.value = undefined;
    successPausedAt.value = Date.now();
    isSuccessPaused.value = true;
  }
}

function resumeSuccessTimer() {
  if (isSuccessPaused.value && successPausedAt.value) {
    const elapsed = Date.now() - successPausedAt.value;
    const newRemainingTime = Math.max(0, 2000 - elapsed);

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

// Watch for hover state changes
watch(isHovered, (newIsHovered) => {
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
    // Upload snackbars have their own timer
    if (snackbar.value.type === "upload") {
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
      snackbar.value.type === "upload" &&
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

function onRemoveSnackbar() {
  isLeaving.value = true;
  // Wait for animation to complete before removing
  setTimeout(() => {
    emit("remove-snackbar", snackbar.value.id);
  }, 300);
}

onMounted(() => {
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
}
</style>
