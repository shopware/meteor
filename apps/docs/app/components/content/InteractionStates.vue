<template>
  <div class="not-prose my-6 rounded-lg border border-muted bg-elevated p-6">
    <div class="flex flex-wrap items-start gap-6">
      <div
        v-for="state in states"
        :key="state"
        class="flex flex-col items-center gap-2.5"
      >
        <button
          tabindex="-1"
          type="button"
          class="inline-flex min-h-8 select-none items-center justify-center rounded-[var(--border-radius-button)] border px-[15px] text-xs font-semibold text-white"
          :class="buttonClasses[state]"
          :disabled="state === 'disabled'"
        >
          Add product
        </button>
        <span class="text-xs text-muted">
          {{ state.charAt(0).toUpperCase() + state.slice(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const states = ["resting", "hover", "focus", "pressed", "disabled"] as const;

const buttonClasses: Record<(typeof states)[number], string> = {
  resting:
    "cursor-pointer border-[var(--color-interaction-primary-default)] bg-[var(--color-interaction-primary-default)]",
  hover:
    "cursor-pointer border-[var(--color-interaction-primary-hover)] bg-[var(--color-interaction-primary-hover)]",
  focus:
    "cursor-pointer border-[var(--color-interaction-primary-default)] bg-[var(--color-interaction-primary-default)] outline-2 outline-offset-2 outline-[var(--color-border-brand-default)]",
  pressed:
    "cursor-pointer border-[var(--color-interaction-primary-pressed)] bg-[var(--color-interaction-primary-pressed)]",
  disabled:
    "cursor-not-allowed border-[var(--color-interaction-primary-disabled)] bg-[var(--color-interaction-primary-disabled)] text-white/55",
};
</script>
