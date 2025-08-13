<template>
  <Teleport to="body">
    <div class="mt-snackbar">
      <TransitionGroup name="snackbars">
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

  .snackbars-enter-from {
    transform: translateY(100%);
    opacity: 0;
  }

  .snackbars-leave-to {
    transform: translateY(200%);
    opacity: 0;
  }

  .snackbars-enter-active {
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }

  .snackbars-leave-active {
    transition:
      opacity 0.1s,
      transform 0.8s;
    transition-timing-function: linear;
  }

  .snackbars-move {
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0.7, 0.1, 0.45, 0.9);
  }
}
</style>
