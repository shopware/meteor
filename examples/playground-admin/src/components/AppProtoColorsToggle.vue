<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import {
  PROTO_COLORS,
  useProtoColors,
  type ProtoColors,
} from "../composables/useProtoColors";
import { isTyping } from "../composables/useThemeShortcut";

const palette = useProtoColors();

const labels: Record<ProtoColors, string> = {
  old: "Old colors",
  new: "New colors",
  contrast: "New + contrast",
};

/** `C` switches between the old and the new colors. From the contrast mode it goes to the old ones. */
function onKeydown(event: KeyboardEvent) {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  if (isTyping(event.target) || event.key.toLowerCase() !== "c") return;
  palette.value = palette.value === "old" ? "new" : "old";
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div
    class="proto-colors-toggle"
    role="group"
    aria-label="Color palettes"
    title="Press C to switch"
  >
    <button
      v-for="option in PROTO_COLORS"
      :key="option"
      type="button"
      :aria-pressed="palette === option"
      @click="palette = option"
    >
      {{ labels[option] }}
    </button>
  </div>
</template>

<style scoped>
/* Prototype only: switches between the current colors, the new palettes and their contrast mode. */
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
