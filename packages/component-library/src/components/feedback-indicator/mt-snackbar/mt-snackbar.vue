<template>
  <Teleport to="body">
    <div class="mt-snackbar">
      <TransitionGroup name="snackbars" :move-class="'snackbars-move'">
        <mt-snackbar-notification
          v-for="(snackbar, index) in snackbars"
          :key="snackbar.id"
          :snackbar="snackbar"
          :style="{ '--num': index }"
          :index="index"
          @remove-snackbar="removeSnackbar"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MtSnackbarNotification from "./_internal/mt-snackbar-notification.vue";
import { useSnackbar } from "./composables/use-snackbar";

const { snackbars, removeSnackbar } = useSnackbar();
</script>

<style scoped>
.mt-snackbar {
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--scale-size-16);
  pointer-events: none;

  /* Initial enter state (position & opacity) */
  .snackbars-enter-from {
    transform: translateY(100%);
    opacity: 0;
  }

  /* Final state when snackbar leaves (position & opacity) */
  .snackbars-leave-to {
    transform: translateX(200%);
    opacity: 0;
  }

  /* Moving state during enter animation (timing & easing) */
  .snackbars-enter-active {
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }

  /* Moving state during leave animation (timing & easing) */
  .snackbars-leave-active {
    transition:
      opacity 0.1s,
      transform 0.8s;
    transition-timing-function: linear;
  }

  /* Enter and leave states (timing & easing) */
  .snackbars-enter,
  .snackbars-leave-to {
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }

  /* Active states for both enter and leave (timing & easing) */
  .snackbars-enter-active,
  .snackbars-leave-active {
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }

  /* Move animation when snackbars reorder - smooth position transitions */
  .snackbars-move {
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }
}
</style>
