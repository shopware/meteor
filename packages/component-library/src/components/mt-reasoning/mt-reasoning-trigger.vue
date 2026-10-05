<template>
  <mt-collapsible-trigger class="mt-reasoning-trigger">
    <mt-status-dot
      :variant="STEP_DOT_VARIANTS[streaming ? 'active' : 'complete']"
      :pulse="streaming"
      class="mt-reasoning-trigger__dot"
    />
    <slot :streaming="streaming" :duration="duration">
      <mt-text-shimmer v-if="streaming || duration === 0" as="span" size="xs">
        {{ t("thinking") }}
      </mt-text-shimmer>
      <mt-text v-else as="span" size="xs" color="color-text-secondary-default">
        {{ duration === undefined ? t("thoughtBriefly") : t("thought", duration) }}
      </mt-text>
    </slot>
    <mt-icon
      name="regular-chevron-down-xs"
      size="10"
      decorative
      class="mt-reasoning-trigger__chevron"
    />
  </mt-collapsible-trigger>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtStatusDot from "@/components/mt-status-dot/mt-status-dot.vue";
import { STEP_DOT_VARIANTS } from "@/components/_internal/ai-status-dot";
import MtText from "@/components/mt-text/mt-text.vue";
import MtTextShimmer from "@/components/mt-text-shimmer/mt-text-shimmer.vue";
import { useReasoningContext } from "./reasoning-context";

/**
 * Opens and closes `mt-reasoning`. It reads "Thinking…" while the model reasons and "Thought for
 * N seconds" afterwards.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** A custom label instead of "Thinking…" and "Thought for N seconds". */
  default?(props: { streaming: boolean; duration: number | undefined }): unknown;
}>();

const { streaming, duration } = useReasoningContext("mt-reasoning-trigger");

const { t } = useI18n({
  messages: {
    en: {
      thinking: "Thinking…",
      thought: "Thought for {n} second | Thought for {n} seconds",
      thoughtBriefly: "Thought for a few seconds",
    },
    de: {
      thinking: "Denkt nach…",
      thought: "{n} Sekunde nachgedacht | {n} Sekunden nachgedacht",
      thoughtBriefly: "Kurz nachgedacht",
    },
  },
});
</script>

<style scoped>
.mt-reasoning-trigger {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  border-radius: var(--border-radius-xs);
  color: var(--color-text-secondary-default);
  cursor: pointer;
}

.mt-reasoning-trigger:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-reasoning-trigger__dot,
.mt-reasoning-trigger__chevron {
  flex-shrink: 0;
  color: var(--color-icon-primary-default);
}

.mt-reasoning-trigger__chevron {
  transition: transform 0.15s ease;
}

.mt-reasoning-trigger[data-state="open"] .mt-reasoning-trigger__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .mt-reasoning-trigger__chevron {
    transition: none;
  }
}
</style>
