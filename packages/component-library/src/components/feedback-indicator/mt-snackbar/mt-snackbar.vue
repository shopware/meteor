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
  gap: var(--scale-size-8);
  pointer-events: none;
}

.mt-snackbar .snackbars-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.mt-snackbar .snackbars-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.mt-snackbar .snackbars-enter-active,
.mt-snackbar .snackbars-leave-active {
  transition: all 0.3s ease;
}

.mt-snackbar .snackbars-move {
  transition: transform 0.3s ease;
}
</style>
