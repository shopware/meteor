<template>
  <li
    class="mt-chain-of-thought-step"
    :class="`mt-chain-of-thought-step--${status}`"
    :aria-current="status === 'active' ? 'step' : undefined"
  >
    <span class="mt-chain-of-thought-step__indicator">
      <mt-status-dot :variant="STEP_DOT_VARIANTS[status]" :pulse="status === 'active'" />
    </span>

    <div class="mt-chain-of-thought-step__body">
      <mt-text
        size="xs"
        :color="
          status === 'pending' ? 'color-text-secondary-disabled' : 'color-text-secondary-default'
        "
      >
        {{ label }}<span class="mt-chain-of-thought-step__status"> ({{ t(status) }})</span>
      </mt-text>

      <mt-text v-if="description" size="xs" color="color-text-secondary-disabled">
        {{ description }}
      </mt-text>

      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { STEP_DOT_VARIANTS } from "@/components/_internal/ai-status-dot";
import MtStatusDot from "@/components/mt-status-dot/mt-status-dot.vue";
import MtText from "@/components/mt-text/mt-text.vue";

type Status = "complete" | "active" | "pending" | "error";

/**
 * One step of `mt-chain-of-thought`, such as reasoning, a search or another tool call.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** What the step does, for example "Searching products…" or "Found 12 products". */
    label: string;
    /** More about the step, shown below the label. */
    description?: string;
    /** Whether the step is done, running, still to come or failed. */
    status?: Status;
  }>(),
  {
    description: undefined,
    status: "complete",
  },
);

defineSlots<{
  /** Details of the step, for example the reasoning text, `mt-badge`s or a result. */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { complete: "completed", active: "in progress", pending: "pending", error: "failed" },
    de: { complete: "erledigt", active: "läuft", pending: "ausstehend", error: "fehlgeschlagen" },
  },
});
</script>

<style>
.mt-chain-of-thought-step {
  position: relative;
  display: grid;
  grid-template-columns: var(--scale-size-16) minmax(0, 1fr);
  gap: var(--scale-size-8);
  animation: mt-chain-of-thought-step-enter 0.2s ease-out;
}

/* the connector runs from this dot to the next one, behind both */
.mt-chain-of-thought-step:not(:last-child)::before {
  content: "";
  position: absolute;
  inset-block-start: calc(var(--font-line-height-xs) / 2);
  inset-inline-start: calc(var(--scale-size-8) - 0.5px);
  height: calc(100% + var(--scale-size-12));
  border-inline-start: 1px solid var(--color-border-primary-default);
}

.mt-chain-of-thought-step__indicator {
  position: relative;
  display: grid;
  place-items: center;
  height: var(--font-line-height-xs);
}

.mt-chain-of-thought-step__body {
  display: grid;
  gap: var(--scale-size-4);
  min-width: 0;
}

.mt-chain-of-thought-step__status {
  position: absolute;
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@keyframes mt-chain-of-thought-step-enter {
  from {
    opacity: 0;
    transform: translateY(var(--scale-size-4));
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-chain-of-thought-step {
    animation: none;
  }
}
</style>
