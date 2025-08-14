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
      <div class="mt-snackbar-notification__text-content">
        <mt-icon v-if="icon" class="mt-snackbar-notification__icon" :name="icon" size="20px" />

        <mt-text
          class="mt-snackbar-notification__message"
          color="color-text-primary"
          weight="medium"
          size="s"
          :class="messageClasses"
        >
          {{ snackbar.message }}
        </mt-text>
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
  };
});

const icon = computed(() => {
  switch (snackbar.value.type) {
    case "error":
      return "solid-exclamation-circle";
    case "success":
      return "solid-check-circle";
    default:
      return undefined;
  }
});

const messageClasses = computed(() => {
  return {
    "mt-snackbar-notification__message--with-icon": !!icon.value,
  };
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
    case "info":
    default:
      return "polite";
  }
});

const { snackbar } = toRefs(props);
const snackbarEl = ref<HTMLElement | null>(null);
const timeoutId = ref<number | undefined>(undefined);
const timeoutStartTime = ref<number | undefined>(undefined);
const remainingTimeOut = ref(snackbar.value.duration || 5000);

watch(
  () => snackbar.value.duration,
  (newDuration) => {
    // Stop timer if duration is 0 (infinite)
    if (newDuration === 0) {
      if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
        timeoutId.value = undefined;
        remainingTimeOut.value = newDuration || 5000;
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
  if (snackbar.value.duration === 0) {
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
  max-width: 360px;
  position: relative;
  overflow: hidden;
  background: var(--color-background-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  box-shadow:
    0px 8px 20px 0px var(--color-elevation-shadow-default),
    0px 8px 20px 0px var(--color-elevation-shadow-default);
  pointer-events: auto;
  padding: var(--scale-size-12);
}

.mt-snackbar-notification__content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: var(--scale-size-12);
}

.mt-snackbar-notification__text-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-snackbar-notification__icon {
  margin-top: 1px;
}

.mt-snackbar-notification__message {
  line-height: 1.4;
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
</style>
