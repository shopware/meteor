<template>
  <div
    class="mt-toast-notification"
    :class="classes"
    ref="toastEl"
    :role="role"
    :aria-live="ariaLive"
    tabindex="0"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @keydown.esc="onRemoveToast"
  >
    <div class="mt-toast-notification__content">
      <div class="mt-toast-notification__content-left">
        <mt-icon
          v-if="toast.icon"
          class="mt-toast-notification__icon"
          :name="toast.icon"
          size="20px"
        />

        <div class="mt-toast-notification__message" :class="messageClasses" :title="toast.msg">
          {{ toast.msg }}
        </div>
      </div>

      <div class="mt-toast-notification__content-right">
        <mt-button v-if="toast.action" @click="onActionClick" size="small">
          {{ toast.action.label }}
        </mt-button>
      </div>

      <div
        v-if="toast.dismissible || toast.action"
        class="mt-toast-notification__close-action"
        aria-hidden="true"
        data-testid="dismiss-toast"
        @click="onRemoveToast"
      >
        <mt-icon name="solid-times-circle" size="20px" />
      </div>
    </div>

    <div v-if="showTimer" class="mt-toast-notification__timer">
      <div class="mt-toast-notification__timer-loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
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
import type { Toast } from "./mt-toast.vue";

const emit = defineEmits(["remove-toast"]);

const props = defineProps({
  toast: {
    type: Object as PropType<Toast>,
    required: true,
  },
  quickDisplay: {
    type: Boolean,
    required: false,
    default: false,
  },
  index: {
    type: Number,
    required: false,
    default: NaN,
  },
});

const classes = computed(() => {
  return {
    "mt-toast-notification--positive": toast.value.type === "positive",
    "mt-toast-notification--critical": toast.value.type === "critical",
    "mt-toast-notification--informal": toast.value.type === "informal",
  };
});

const messageClasses = computed(() => {
  return {
    "mt-toast-notification__message-space": !!toast.value.icon,
  };
});

const showTimer = computed(() => {
  // If autoClose is set, use that value
  if (toast.value.autoClose !== undefined) {
    return toast.value.autoClose;
  }

  // Quick toasts, toasts in background and critical toasts with an action never show a timer
  if (
    quickDisplay.value ||
    index.value !== 0 ||
    (toast.value.type === "critical" && toast.value.action)
  ) {
    return false;
  }

  return true;
});

const role = computed(() => {
  if (toast.value.type === "critical" && toast.value.action) {
    return "alertdialog";
  }

  switch (toast.value.type) {
    case "positive":
    case "informal":
    default:
      return "log";
    case "critical":
      return "alert";
  }
});

const ariaLive = computed(() => {
  switch (toast.value.type) {
    case "positive":
    case "informal":
    default:
      return "polite";
    case "critical":
      return "assertive";
  }
});

const { toast, quickDisplay, index } = toRefs(props);
const toastEl = ref<HTMLElement | null>(null);
let timeoutId = ref<number | undefined>(undefined);
let timeoutStartTime = ref<number | undefined>(undefined);
let remainingTimeOut = ref(quickDisplay.value ? 3700 : 10500);

watch(
  showTimer,
  (newValue) => {
    // Stop timer?
    if (!newValue && !quickDisplay.value) {
      // CallbackId exists?
      if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
        timeoutId.value = undefined;
        remainingTimeOut.value = 10500;
      }

      return;
    }

    // Start timer
    timeoutStartTime.value = Date.now();
    timeoutId.value = window.setTimeout(() => {
      onRemoveToast();
    }, remainingTimeOut.value);
  },
  { immediate: true },
);

function pauseTimer() {
  if (!timeoutId.value || quickDisplay.value) {
    return;
  }

  // Terminate current timeout
  window.clearTimeout(timeoutId.value);

  const previousTime = timeoutStartTime.value ?? Date.now();

  // Calculate the remaining timeout for the toast
  remainingTimeOut.value = remainingTimeOut.value - (Date.now() - previousTime);
}

function resumeTimer() {
  if (!showTimer.value || quickDisplay.value) {
    return;
  }

  // Start timer
  timeoutStartTime.value = Date.now();
  timeoutId.value = window.setTimeout(() => {
    onRemoveToast();
  }, remainingTimeOut.value);
}

function onRemoveToast() {
  // Timout can be skipped for manual removal
  if (timeoutId.value) {
    window.clearTimeout(timeoutId.value);
  }

  emit("remove-toast", toast.value.id);
}

function onActionClick() {
  // Trigger callback
  toast.value?.action?.callback();

  // Remove toast
  onRemoveToast();
}

onMounted(() => {
  if (!toastEl.value || !toast.value.action || toast.value.type !== "critical") {
    return;
  }

  toastEl.value?.focus();
});

onBeforeUnmount(() => {
  if (!timeoutId.value) {
    return;
  }

  window.clearTimeout(timeoutId.value);
});
</script>

<style scoped lang="scss">
.mt-toast-notification {
  position: absolute;
  bottom: 0;
  border-radius: 4px;
  margin-bottom: 17px;
  display: flex;
  flex-direction: column;
  height: 56px;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 2px 1px 0px rgba(0, 0, 0, 0.06),
    0px 1px 1px 0px rgba(0, 0, 0, 0.08);
  outline: none;

  &:hover {
    .mt-toast-notification__timer-loader {
      animation-play-state: paused;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    border: 2px solid $color-white;
  }

  &__content {
    height: 100%;
    display: flex;
    align-items: center;

    &-left {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      margin-left: 16px;
      align-items: center;
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      margin-right: 16px;
      align-items: center;
    }

    &.mt-icon > svg {
      fill: black;
      width: 20px !important;
      height: 20px !important;
    }
  }

  &--positive {
    border: 1px solid $color-emerald-500;
    background-color: $color-emerald-500;

    .mt-toast-notification__close-action {
      border-left: 1px solid $color-emerald-900;
    }

    .mt-toast-notification__timer {
      background-color: $color-emerald-900;
    }
  }

  &--critical {
    border: 1px solid $color-crimson-500;
    background-color: $color-crimson-500;

    .mt-toast-notification__close-action {
      border-left: 1px solid $color-crimson-900;
    }

    .mt-toast-notification__timer {
      background-color: $color-crimson-900;
    }
  }

  &--informal {
    border: 1px solid $color-darkgray-700;
    background-color: $color-darkgray-700;

    .mt-toast-notification__close-action {
      border-left: 1px solid $color-darkgray-900;
    }

    .mt-toast-notification__timer {
      background-color: $color-darkgray-900;
    }
  }

  &__message {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: $color-white;
    font-family: $font-family-default;
    font-size: $font-size-xs;
    font-style: normal;
    font-weight: $font-weight-semi-bold;
    line-height: 16px;
    letter-spacing: 0.08px;

    &-space {
      padding-left: 8px;
    }
  }

  &__close-action {
    margin-left: auto;
    height: 100%;
    display: flex;
    padding: 12px;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    color: $color-white;
    transition: color 0.2s ease;

    &:hover {
      color: $color-gray-200;
      box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
    }
  }

  &__timer {
    height: 3px;
    width: 100%;
    border-radius: 0 0 4px 4px;
    background-color: $color-white;

    &-loader {
      top: 0;
      left: 100%;
      width: 100%;
      height: 100%;
      background-color: white;
      transform-origin: 0% 0%;
      animation: shrink 10s forwards linear 0.5s;
    }
  }

  @keyframes shrink {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
}
</style>
