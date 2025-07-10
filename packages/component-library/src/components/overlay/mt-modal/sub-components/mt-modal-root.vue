<template>
  <slot />

  <transition name="fade">
    <Teleport to="body">
      <div
        class="mt-modal-root__backdrop"
        v-if="isOpen"
        aria-hidden
        data-testid="modal-backdrop"
        @click="() => setIsOpen(false)"
      />
    </Teleport>
  </transition>
</template>

<script setup lang="ts">
import { provide, ref, watch } from "vue";
import { DialogContext } from "../composables/useModalContext";

const props = defineProps<{ isOpen?: boolean }>();

const emit = defineEmits(["change"]);

const isOpen = ref(props.isOpen);

watch(isOpen, () => {
  emit("change", isOpen.value);
});

watch(
  () => props.isOpen,
  (value) => {
    isOpen.value = value;
  },
);

function setIsOpen(state: boolean) {
  isOpen.value = state;
}

provide(DialogContext, {
  isOpen,
  setIsOpen,
});
</script>

<style scoped>
.mt-modal-root__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-elevation-surface-backdrop, #101013);
  z-index: 1000;
  opacity: 0.6;
}

.fade-enter-active {
  transition: opacity 150ms cubic-bezier(0.3, 0, 1, 1);
}

.fade-leave-active {
  transition: opacity 150ms cubic-bezier(0, 0, 0, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
