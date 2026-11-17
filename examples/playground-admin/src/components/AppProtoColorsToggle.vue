<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useProtoColors } from "../composables/useProtoColors";
import { isTyping } from "../composables/useThemeShortcut";

const isNew = useProtoColors();

/** `V` switches between the old and the new colors. */
function onKeydown(event: KeyboardEvent) {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  if (isTyping(event.target) || event.key.toLowerCase() !== "v") return;
  isNew.value = !isNew.value;
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div
    class="proto-colors-toggle"
    role="group"
    aria-label="Color palettes"
    title="Press V to switch"
  >
    <button type="button" :aria-pressed="!isNew" @click="isNew = false">
      Old colors
    </button>
    <button type="button" :aria-pressed="isNew" @click="isNew = true">
      New colors
    </button>
  </div>
</template>

<style scoped>
/* Prototype only: switches between the current and the new color palettes. */
.proto-colors-toggle {
  position: fixed;
  z-index: 10000;
  bottom: var(--scale-size-16);
  left: 50%;
  display: flex;
  gap: var(--scale-size-2);
  padding: var(--scale-size-2);
  border-radius: var(--border-radius-round);
  background-color: var(--color-elevation-floating-default);
  box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default);
  transform: translateX(-50%);
}

.proto-colors-toggle button {
  padding: var(--scale-size-6) var(--scale-size-12);
  border: none;
  border-radius: var(--border-radius-round);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-inverse);
  background: transparent;
  cursor: pointer;
}

.proto-colors-toggle button[aria-pressed="true"] {
  color: var(--color-text-primary-default);
  background-color: var(--color-elevation-surface-default);
}

.proto-colors-toggle button:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}
</style>
