<template>
  <transition name="fade">
    <Teleport to="body">
      <div
        class="mt-modal-root__backdrop"
        v-if="isOpen"
        aria-hidden
        data-testid="modal-backdrop"
        @click="
          () => {
            if (closable) setIsOpen(false);
          }
        "
      />
    </Teleport>
  </transition>

  <slot />
</template>

<script setup lang="ts">
import { provide, ref, watch } from "vue";
import { DialogContext } from "../composables/useModalContext";

const props = withDefaults(defineProps<{ isOpen?: boolean; closable?: boolean }>(), {
  closable: true,
});

const emit = defineEmits(["change"]);

const isOpen = ref(props.isOpen);
const closable = ref(props.closable);

watch(isOpen, () => {
  emit("change", isOpen.value);
});

watch(
  () => props.isOpen,
  (value) => {
    isOpen.value = value;
  },
);

watch(
  () => props.closable,
  (value) => {
    closable.value = value ?? true;
  },
);

function setIsOpen(state: boolean) {
  isOpen.value = state;
}

provide(DialogContext, {
  isOpen,
  setIsOpen,
  closable,
});
</script>

<style scoped>
.mt-modal-root__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-elevation-backdrop-default);
  z-index: 1000;
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
