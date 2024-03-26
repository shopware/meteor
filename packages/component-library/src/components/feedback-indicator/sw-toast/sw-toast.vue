<template>
<div
  class="sw-toast"
  :class="classes"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
>
  <div class="sw-toast__left">
  </div>
  <div class="sw-toast__center">
    <Transition name="short-notice-toast">
      <SwToastNotification
          v-if="centerToast"
          :toast="centerToast"
          @remove-toast="$emit('remove-toast', centerToast.id)"
          :short-notice="true"
          :key="centerToast.id"
      />
    </Transition>
  </div>
  <div class="sw-toast__right">
    <TransitionGroup name="toasts">
      <SwToastNotification
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
import { type PropType, ref, toRef, defineProps, computed, watch, defineEmits, nex } from 'vue';
import SwToastNotification from './sw-toast-notification.vue';

export interface Toast {
  id: number,
  index: number,

  // Public api
  icon: string,
  msg: string,
  action?: {
    label: string,
    callback: () => void,
  },
  dismissable: boolean,
  type: 'informal' | 'critical' | 'positive',
}

const emit = defineEmits(['remove-toast'])

const props = defineProps({
  toasts: {
    type: Array as PropType<Toast[]>,
    required: true,
  }
})

const isHovered = ref(false);
const toasts= toRef(() => props.toasts);
const hoverTimeoutId = ref<number|undefined>(undefined);

const centerToast = computed(() => {
  const ct = toasts.value.filter(t => {
    return !t.action && t.type !== 'critical' && !t.dismissable;
  });

  return ct[0];
});

const rightToasts = computed(() => {
  return toasts.value.filter(t => {
    return t.action || t.type === 'critical' || t.dismissable;
  });
});

const classes = computed(() => {
  return {
    'sw-toast__collapsed': !isHovered.value,
    'sw-toast__expanded': isHovered.value,
  }
})

watch(centerToast, (_, oldToast) => {
  if (!oldToast) {
    return;
  }

  emit('remove-toast', oldToast.id);
})

function onMouseEnter() {
  if (hoverTimeoutId.value) {
    window.clearTimeout(hoverTimeoutId.value);
  }

  isHovered.value = true;
}

function onMouseLeave() {
  hoverTimeoutId.value = window.setTimeout(() => {
    isHovered.value = false;
  }, 500)
}
</script>
  
<style lang="scss">
.sw-toast {
  display: flex;
  position: fixed;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;

  &__left {
    flex: 1;
  }

  &__center {
    flex: 1;
    display: flex;
    justify-content: center;

    .sw-toast-notification {
      display: flex;
      z-index: 11;
      position: absolute;
      height: 51px;
      color: white;
      text-align: center;
      transform: translateY(0);
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 2px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
    }

    .short-notice-toast-enter-active,
    .short-notice-toast-leave-active {
      transition: opacity 0.5s ease;
    }

    .short-notice-toast-enter-from,
    .short-notice-toast-leave-to {
      opacity: 0;
    }

    .short-notice-toast-enter-active {
      transition-delay: 0.5s;
    }
  }

  &__right {
    flex: 1;
    display: flex;
    justify-content: center;

    .sw-toast-notification {
      display: flex;
      transition: all 0.7s ease;
      z-index: 11;
      position: absolute;
      height: 51px;
      color: white;
      width: 300px;
      text-align: center;
      transform: translateY(0);
    }

    .toasts-enter-from {
      transform: translateY(50px) !important;
      opacity: 0;
      z-index: 0;
    }

    .toasts-leave-to {
      transform: scale(0.9, 0.4) !important;
      transform-origin: top;
      opacity: 0;
      z-index: 0;
    }

    .toasts-enter-active,
    .toasts-leave-active {
      transition: all 0.7s ease;
    }
  }

  // Expanded state
  &__expanded {
    .sw-toast-notification:nth-child(n+2) {
      // 51px height + 17px margin?
      transform: translateY(calc(var(--num) * -68px));
    }
  }

  // Collapsed state
  &__collapsed {
    .sw-toast-notification:nth-child(1) {
      //box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 2px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
      z-index: 10;
    }
    
    .sw-toast-notification:nth-child(n + 2) {
      //border-radius: 20%;
    }

    .sw-toast-notification:nth-child(2) {
      transform: translateY(-32px) scale(0.95, 0.1);
    
      .sw-toast-notification__content {
        opacity: 0;
      }
    }
    
    .sw-toast-notification:nth-child(3) {
      transform: translateY(-41px) scale(0.9, 0.1);
    
      .sw-toast-notification__content {
        opacity: 0;
      }
    }
    
    .sw-toast-notification:nth-child(n + 4) {
      transform: translateY(-50px) scale(0.8, 0.1);
      opacity: 0;
    
      .sw-toast-notification__content {
        opacity: 0;
      }
    }
  }
}
</style>