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
    <TransitionGroup name="toasts">
      <SwToastNotification
          v-for="(toast, index) in centerToasts"
          :key="toast.id"
          :toast="toast"
          @remove-toast="$emit('remove-toast', toast.id)"
          :style="{ '--num': index }"
          :show-timer="toast.type !== 'critical' && index === 0"
      />
    </TransitionGroup>
  </div>
  <div class="sw-toast__right">
    <TransitionGroup name="toasts">
      <SwToastNotification
          v-for="(toast, index) in rightToasts"
          :key="toast.id"
          :toast="toast"
          @remove-toast="$emit('remove-toast', toast.id)"
          :style="{ '--num': index }"
          :show-timer="toast.type !== 'critical' && index === 0"
      />
    </TransitionGroup>
  </div>
</div>
</template>
  
<script setup lang="ts">
import { type PropType, ref, toRef, defineProps, computed } from 'vue';
import SwToastNotification from './sw-toast-notification.vue';
 
/**
 * sw.toast({
 *   msg: '',
 *   category: 'short-notice' | 'long-lasting'
 * })
 */
export interface Toast {
  id: number,
  index: number,
  autoClose: boolean,

  // Public api
  msg: string,
  type: 'critical' | 'positive' | 'default',
  pos: 'center' | 'right',
  action?: () => Promise<void>,
  icon: string,
}

const props = defineProps({
  toasts: {
    type: Array as PropType<Toast[]>,
    required: true,
  }
})

const isHovered = ref(false);
const classes = computed(() => {
  return {
    'sw-toast__collapsed': !isHovered.value,
    'sw-toast__expanded': isHovered.value,
  }
})

const toasts= toRef(() => props.toasts);

const rightToasts = computed(() => {
  return toasts.value.filter(t => t.pos === 'right');
});

const centerToasts = computed(() => {
  return toasts.value.filter(t => t.pos === 'center');
});

const hoverTimeoutId = ref<number|undefined>(undefined);
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
  }

  &__right {
    flex: 1;
    display: flex;
    justify-content: center;
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
      z-index: 10;
    }
    
    .sw-toast-notification:nth-child(2) {
      transform: translateY(-34px) scale(0.95, 0.1);
    
      .sw-toast-notification__content {
        opacity: 0;
      }
    }
    
    .sw-toast-notification:nth-child(3) {
      transform: translateY(-43px) scale(0.9, 0.1);
    
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
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 2px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
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
</style>