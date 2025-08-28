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
  width: 360px;
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--scale-size-16);
  pointer-events: none;

  .snackbars-move,
  .snackbars-enter-active,
  .snackbars-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .snackbars-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }

  .snackbars-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .snackbars-leave-active {
    position: absolute;
  }
}
</style>
