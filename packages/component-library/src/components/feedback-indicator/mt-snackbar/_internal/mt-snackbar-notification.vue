<template>
  <div
    ref="snackbarEl"
    class="mt-snackbar-notification"
    :class="classes"
    :role="role"
    :aria-live="ariaLive"
    tabindex="0"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="mt-snackbar-notification__content">
      <div class="mt-snackbar-notification__content-left">
        <mt-icon
          v-if="snackbar.icon"
          class="mt-snackbar-notification__icon"
          :name="snackbar.icon"
          size="20px"
        />

        <div class="mt-snackbar-notification__text-content">
          <mt-text
            class="mt-snackbar-notification__message"
            color="color-text-primary"
            weight="medium"
            size="s"
            :class="messageClasses"
          >
            {{ snackbar.message }}
          </mt-text>

          <mt-link
            v-if="snackbar.link"
            class="mt-snackbar-notification__link"
            :href="snackbar.link.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ snackbar.link.text }}
          </mt-link>
        </div>
      </div>

      <div
        v-if="snackbar.dismissible === true"
        class="mt-snackbar-notification__close-action"
        aria-hidden="true"
        data-testid="dismiss-snackbar"
        @click="onRemoveSnackbar"
      >
        <mt-icon name="solid-times-circle" size="20px" />
      </div>
    </div>

    <div v-if="showTimer" class="mt-snackbar-notification__timer">
      <div class="mt-snackbar-notification__timer-loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtLink from "@/components/navigation/mt-link/mt-link.vue";
import {
  defineProps,
  toRefs,
  type PropType,
  computed,
  watch,
  ref,
  onBeforeUnmount,
  onMounted,
} from "vue";
import type { Snackbar } from "../composables/use-snackbar";

const emit = defineEmits(["remove-snackbar"]);

const props = defineProps({
  snackbar: {
    type: Object as PropType<Snackbar>,
    required: true,
  },
  index: {
    type: Number,
    required: false,
    default: 0,
  },
});

const classes = computed(() => {
  return {
    "mt-snackbar-notification--success": snackbar.value.type === "success",
    "mt-snackbar-notification--error": snackbar.value.type === "error",
    "mt-snackbar-notification--warning": snackbar.value.type === "warning",
    "mt-snackbar-notification--info": snackbar.value.type === "info",
  };
});

const messageClasses = computed(() => {
  return {
    "mt-snackbar-notification__message--with-icon": !!snackbar.value.icon,
  };
});

const showTimer = computed(() => {
  // Don't show timer for dismissible snackbars or if duration is 0
  if (snackbar.value.dismissible || snackbar.value.duration === 0) {
    return false;
  }

  return true;
});

const role = computed(() => {
  switch (snackbar.value.type) {
    case "error":
      return "alert";
    case "warning":
      return "alert";
    case "success":
    case "info":
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
    case "info":
    default:
      return "polite";
  }
});

const { snackbar, index } = toRefs(props);
const snackbarEl = ref<HTMLElement | null>(null);
const timeoutId = ref<number | undefined>(undefined);
const timeoutStartTime = ref<number | undefined>(undefined);
const remainingTimeOut = ref(snackbar.value.duration || 5000);

watch(
  showTimer,
  (newValue) => {
    // Stop timer?
    if (!newValue) {
      if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
        timeoutId.value = undefined;
        remainingTimeOut.value = snackbar.value.duration || 5000;
      }
      return;
    }

    // Start timer
    timeoutStartTime.value = Date.now();
    timeoutId.value = window.setTimeout(() => {
      onRemoveSnackbar();
    }, remainingTimeOut.value);
  },
  { immediate: true },
);

function pauseTimer() {
  if (!timeoutId.value) {
    return;
  }

  // Terminate current timeout
  window.clearTimeout(timeoutId.value);

  const previousTime = timeoutStartTime.value ?? Date.now();

  // Calculate the remaining timeout for the snackbar
  remainingTimeOut.value = remainingTimeOut.value - (Date.now() - previousTime);
}

function resumeTimer() {
  if (!showTimer.value) {
    return;
  }

  // Start timer
  timeoutStartTime.value = Date.now();
  timeoutId.value = window.setTimeout(() => {
    onRemoveSnackbar();
  }, remainingTimeOut.value);
}

function onRemoveSnackbar() {
  emit("remove-snackbar", snackbar.value.id);
}

onMounted(() => {
  // Focus the snackbar for accessibility
  if (snackbarEl.value) {
    snackbarEl.value.focus();
  }
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    window.clearTimeout(timeoutId.value);
  }
});
</script>

<style scoped>
.mt-snackbar-notification {
  display: flex;
  flex-direction: column;
  background: var(--color-background-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--border-radius-lg);
  box-shadow:
    0px 4px 6px -2px rgba(0, 0, 0, 0.05),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;
  position: relative;
  overflow: hidden;
}

.mt-snackbar-notification__content {
  display: flex;
  align-items: flex-start;
  padding: var(--scale-size-12) var(--scale-size-16);
  gap: var(--scale-size-12);
}

.mt-snackbar-notification__content-left {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-8);
  flex: 1;
  min-width: 0;
}

.mt-snackbar-notification__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.mt-snackbar-notification__text-content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  min-width: 0;
  flex: 1;
}

.mt-snackbar-notification__message {
  line-height: 1.4;
  word-wrap: break-word;
}

.mt-snackbar-notification__message--with-icon {
  margin-left: 0;
}

.mt-snackbar-notification__link {
  font-size: var(--font-size-sm);
  text-decoration: underline;
  color: var(--color-primary-500);
}

.mt-snackbar-notification__link:hover {
  color: var(--color-primary-600);
}

.mt-snackbar-notification__close-action {
  flex-shrink: 0;
  cursor: pointer;
  padding: var(--scale-size-4);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.mt-snackbar-notification__close-action:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}

.mt-snackbar-notification__timer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-border-default);
}

.mt-snackbar-notification__timer-loader {
  height: 100%;
  background: var(--color-primary-500);
  animation: snackbar-timer 5s linear;
}

/* Type-specific styles */
.mt-snackbar-notification--success {
  border-left: 4px solid var(--color-success-500);
}

.mt-snackbar-notification--success .mt-snackbar-notification__icon {
  color: var(--color-success-500);
}

.mt-snackbar-notification--success .mt-snackbar-notification__timer-loader {
  background: var(--color-success-500);
}

.mt-snackbar-notification--error {
  border-left: 4px solid var(--color-danger-500);
}

.mt-snackbar-notification--error .mt-snackbar-notification__icon {
  color: var(--color-danger-500);
}

.mt-snackbar-notification--error .mt-snackbar-notification__timer-loader {
  background: var(--color-danger-500);
}

.mt-snackbar-notification--warning {
  border-left: 4px solid var(--color-warning-500);
}

.mt-snackbar-notification--warning .mt-snackbar-notification__icon {
  color: var(--color-warning-500);
}

.mt-snackbar-notification--warning .mt-snackbar-notification__timer-loader {
  background: var(--color-warning-500);
}

.mt-snackbar-notification--info {
  border-left: 4px solid var(--color-info-500);
}

.mt-snackbar-notification--info .mt-snackbar-notification__icon {
  color: var(--color-info-500);
}

.mt-snackbar-notification--info .mt-snackbar-notification__timer-loader {
  background: var(--color-info-500);
}

@keyframes snackbar-timer {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
