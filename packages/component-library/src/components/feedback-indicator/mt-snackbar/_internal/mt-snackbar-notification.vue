<template>
  <div
    ref="snackbarEl"
    class="mt-snackbar-notification"
    :class="classes"
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
          <mt-loader
            v-if="snackbar.type === 'upload'"
            class="mt-snackbar-notification__loader"
            size="16px"
          />
          <mt-icon
            v-else-if="icon"
            class="mt-snackbar-notification__icon"
            :name="icon"
            size="16px"
          />
        </div>

        <mt-text
          class="mt-snackbar-notification__message"
          color="color-text-primary"
          weight="medium"
          size="xs"
        >
          {{ snackbar.message }}
        </mt-text>
        <div v-if="snackbar.type === 'upload'" class="mt-snackbar-notification__progress">
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
    "mt-snackbar-notification--upload": snackbar.value.type === "upload",
  };
});

const progressPercentage = computed(() => {
  return `(${snackbar.value.progressPercentage || 0}%)`;
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

const { snackbar } = toRefs(props);
const snackbarEl = ref<HTMLElement | null>(null);
const timeoutId = ref<number | undefined>(undefined);
const timeoutStartTime = ref<number | undefined>(undefined);
const remainingTimeOut = ref(snackbar.value.duration || 5000);

watch(
  () => snackbar.value.duration,
  (newDuration) => {
    // Exclude upload type snackbars
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

    // Start timer
    timeoutStartTime.value = Date.now();
    timeoutId.value = window.setTimeout(() => {
      onRemoveSnackbar();
    }, remainingTimeOut.value);
  },
  { immediate: true },
);

watch(
  () => snackbar.value.progressPercentage,
  (newProgress) => {
    if (snackbar.value.type === "upload" && newProgress === 100) {
      onRemoveSnackbar();
    }
  },
);

function onRemoveSnackbar() {
  emit("remove-snackbar", snackbar.value.id);
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
});
</script>

<style scoped>
.mt-snackbar-notification {
  max-width: 360px;
  width: fit-content;
  position: relative;
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
