<template>
  <div class="mt-toast" :class="classes" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- This is here for layout reasons -->
    <div class="mt-toast--bottom-left"></div>

    <div class="mt-toast--bottom-center">
      <Transition name="quick-toasts">
        <mt-toast-notification
          v-if="quickToast"
          :toast="quickToast"
          @remove-toast="$emit('remove-toast', quickToast.id)"
          :quick-display="true"
          :key="quickToast.id"
        />
      </Transition>
    </div>

    <div class="mt-toast--bottom-right">
      <TransitionGroup name="toasts">
        <mt-toast-notification
          v-for="(toast, index) in rightToasts"
          :key="toast.id"
          :toast="toast"
          @remove-toast="$emit('remove-toast', toast.id)"
          :style="{ '--num': index }"
          :index="index"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, toRef, computed, watch } from "vue";
import MtToastNotification from "./mt-toast-notification.vue";

export interface Toast {
  id: number | string;

  // Public api
  msg: string; // Toast message
  type: "informal" | "critical" | "positive"; // Toast type
  icon?: string; // An icon to be displayed before the message
  // Adds a button to the toast
  action?: {
    label: string; // Label of the button
    callback: () => void; // Callback will be called on click
  };
  dismissible?: boolean; // Toggles if the toast is manually closable
}

const emit = defineEmits(["remove-toast"]);

const props = defineProps({
  /**
   * A collection of toasts. The most current one needs to be prepended.
   */
  toasts: {
    type: Array as PropType<Toast[]>,
    required: true,
  },
});

const isHovered = ref(false);
const toasts = toRef(() => props.toasts);
const hoverTimeoutId = ref<number | undefined>(undefined);

const quickToast = computed(() => {
  const ct = toasts.value.filter((t) => {
    return !t.action && t.type !== "critical" && !t.dismissible;
  });

  return ct[0];
});

const rightToasts = computed(() => {
  return toasts.value.filter((t) => {
    return t.action || t.type === "critical" || t.dismissible;
  });
});

const classes = computed(() => {
  return {
    "mt-toast--collapsed": !isHovered.value,
    "mt-toast--expanded": isHovered.value,
  };
});

watch(quickToast, (_, oldToast) => {
  if (!oldToast) {
    return;
  }
  emit("remove-toast", oldToast.id);
});

function onMouseEnter() {
  if (hoverTimeoutId.value) {
    window.clearTimeout(hoverTimeoutId.value);
  }

  isHovered.value = true;
}

function onMouseLeave() {
  hoverTimeoutId.value = window.setTimeout(() => {
    isHovered.value = false;
  }, 500);
}
</script>

<style scoped>
.mt-toast {
  display: flex;
  position: fixed;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
}

.mt-toast--bottom-left {
  flex: 1;
}

.mt-toast--bottom-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.mt-toast--bottom-center .mt-toast-notification {
  display: flex;
  z-index: 1600;
  position: absolute;
  height: 51px;
  color: white;
  text-align: center;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 2px 1px 0px rgba(0, 0, 0, 0.06),
    0px 1px 1px 0px rgba(0, 0, 0, 0.08);
}

.mt-toast--bottom-center .quick-toasts-enter-active,
.mt-toast--bottom-center .quick-toasts-leave-active {
  transition: opacity 0.5s ease;
}

.mt-toast--bottom-center .quick-toasts-enter-from,
.mt-toast--bottom-center .quick-toasts-leave-to {
  opacity: 0;
}

.mt-toast--bottom-center .quick-toasts-enter-active {
  transition-delay: 0.5s;
}

.mt-toast--bottom-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: var(--scale-size-16);
}

.mt-toast--bottom-right .mt-toast-notification {
  display: flex;
  transition: all 0.7s ease;
  z-index: 1600;
  position: absolute;
  height: 51px;
  color: white;
  width: 376px;
  text-align: center;
  transform: translateY(0);
}

.mt-toast--bottom-right .toasts-enter-from {
  transform: translateY(50px) !important;
  opacity: 0;
  z-index: 0;
}

.mt-toast--bottom-right .toasts-leave-to {
  transform: scale(0.9, 0.4) !important;
  transform-origin: top;
  opacity: 0;
  z-index: 0;
}

.mt-toast--bottom-right .toasts-enter-active,
.mt-toast--bottom-right .toasts-leave-active {
  transition: all 0.7s ease;
}

.mt-toast--expanded .mt-toast--bottom-right .mt-toast-notification:nth-child(n + 2) {
  transform: translateY(calc(var(--num) * -68px));
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(1) {
  z-index: 1599;
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(2) {
  transform: translateY(-33px) scale(0.95, 0.18);
  border-top-left-radius: calc(4px / 0.95) calc(4px / 0.18);
  border-top-right-radius: calc(4px / 0.95) calc(4px / 0.18);
  border-bottom-left-radius: calc(2px / 0.95) calc(2px / 0.18);
  border-bottom-right-radius: calc(2px / 0.95) calc(2px / 0.18);
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(3) {
  transform: translateY(-45px) scale(0.9, 0.18);
  border-top-left-radius: calc(4px / 0.9) calc(4px / 0.18);
  border-top-right-radius: calc(4px / 0.9) calc(4px / 0.18);
  border-bottom-left-radius: calc(2px / 0.9) calc(2px / 0.18);
  border-bottom-right-radius: calc(2px / 0.9) calc(2px / 0.18);
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(n + 4) {
  transform: translateY(-58px) scale(0.8, 0.1);
  opacity: 0;
}
</style>

<style>
.mt-toast--collapsed .mt-toast-notification:nth-child(n + 2) .mt-toast-notification__content {
  opacity: 0;
}
</style>
