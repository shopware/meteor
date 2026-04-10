<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    confirmLabel: string;
    destructive?: boolean;
    open: boolean;
    testId: string;
  }>(),
  {
    destructive: false,
  }
);

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const cancelButtonRef = ref<HTMLButtonElement | null>(null);
const confirmButtonRef = ref<HTMLButtonElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

const dialogClasses = computed(() => ({
  "workspace-confirm-dialog": true,
  "workspace-confirm-dialog--destructive": props.destructive,
}));

function collectFocusableElements(): HTMLButtonElement[] {
  return [cancelButtonRef.value, confirmButtonRef.value].filter(
    (element): element is HTMLButtonElement => element !== null
  );
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    emit("cancel");
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = collectFocusableElements();

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousActiveElement.value =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      await nextTick();
      cancelButtonRef.value?.focus();
      return;
    }

    previousActiveElement.value?.focus();
  }
);
</script>

<template>
  <div
    v-if="open"
    :class="dialogClasses"
    :data-testid="testId"
    @keydown="handleKeydown"
  >
    <div
      class="workspace-confirm-dialog__backdrop"
      @click="emit('cancel')"
    />
    <section
      aria-modal="true"
      class="workspace-confirm-dialog__panel"
      role="dialog"
    >
      <header class="workspace-confirm-dialog__header">
        <slot name="title" />
      </header>
      <div class="workspace-confirm-dialog__body">
        <slot />
      </div>
      <footer class="workspace-confirm-dialog__footer">
        <button
          ref="cancelButtonRef"
          class="workspace-confirm-dialog__button"
          type="button"
          @click="emit('cancel')"
        >
          Keep draft
        </button>
        <button
          ref="confirmButtonRef"
          :class="[
            'workspace-confirm-dialog__button',
            'workspace-confirm-dialog__button--primary',
            { 'workspace-confirm-dialog__button--destructive': destructive },
          ]"
          type="button"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.workspace-confirm-dialog {
  inset: 0;
  position: fixed;
  z-index: 20;
}

.workspace-confirm-dialog__backdrop {
  background: rgba(15, 23, 42, 0.32);
  inset: 0;
  position: absolute;
}

.workspace-confirm-dialog__panel {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
  left: 50%;
  max-width: 480px;
  padding: 24px;
  position: relative;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
}

.workspace-confirm-dialog__header :deep(h2) {
  color: #0f172a;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.workspace-confirm-dialog__body {
  color: #475569;
  line-height: 1.5;
  margin-top: 12px;
}

.workspace-confirm-dialog__body :deep(p) {
  margin: 0;
}

.workspace-confirm-dialog__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.workspace-confirm-dialog__button {
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  color: #0f172a;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-weight: 600;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
}

.workspace-confirm-dialog__button--primary {
  background: #0870ff;
  border-color: #0870ff;
  color: #ffffff;
}

.workspace-confirm-dialog__button--destructive {
  background: #e2262a;
  border-color: #e2262a;
}
</style>
