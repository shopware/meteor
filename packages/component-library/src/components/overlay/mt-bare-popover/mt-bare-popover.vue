<template>
  <slot
    name="trigger"
    v-bind="{
      onClick: toggleDialog,
      id: `mt-popover__trigger--${id}`,
      'aria-haspopup': 'dialog',
    }"
  />

  <div
    v-if="isVisible"
    role="dialog"
    class="mt-bare-popover__dialog"
    ref="dialogRef"
    tabindex="-1"
    :style="floatingStyles"
  >
    <mt-text as="h4" size="s" weight="semibold" class="mt-bare-popover__title">Title</mt-text>

    <ul class="mt-bare-popover__list">
      <slot name="default" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { flip, offset, shift, useFloating } from "@floating-ui/vue";
import { createId } from "@/utils/id";
import { onClickOutside, useEventListener } from "@vueuse/core";

const triggerRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const { floatingStyles } = useFloating(triggerRef, dialogRef, {
  middleware: [offset(8), flip(), shift()],
  placement: "bottom-start",
});

const isVisible = ref(false);

function toggleDialog() {
  if (isVisible.value) {
    isVisible.value = false;
    return;
  }

  isVisible.value = true;
  nextTick(() => {
    dialogRef.value?.focus();
  });
}

const id = ref("");
onMounted(() => {
  id.value = createId();

  nextTick(() => {
    const trigger = document.querySelector<HTMLElement>(`#mt-popover__trigger--${id.value}`);
    if (!trigger)
      throw new Error(
        "Failed to render mt-popover; Trigger not found, please make sure the trigger is rendered.",
      );

    triggerRef.value = trigger;
  });
});

onClickOutside(dialogRef, (event) => {
  const clickedOnTrigger = (event.target as HTMLElement | null)?.closest(
    `#mt-popover__trigger--${id.value}`,
  );

  if (clickedOnTrigger) return;

  isVisible.value = false;
});

// needs to be in onMounted to avoid SSR issues
onMounted(() => {
  useEventListener(dialogRef, "keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) return;

    const pressedEscape = event.key === "Escape";
    if (pressedEscape) isVisible.value = false;

    if (triggerRef.value) triggerRef.value.focus();
  });
});
</script>

<style scoped>
.mt-bare-popover__dialog {
  padding: 1rem;
  box-shadow:
    0px 1px 1px 0px rgba(0, 0, 0, 0.08),
    0px 2px 1px 0px rgba(0, 0, 0, 0.06),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-overlay);
  width: max-content;

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-bare-popover__title {
  margin-block-end: 0;
}

.mt-bare-popover__list {
  list-style: none;
}
</style>
