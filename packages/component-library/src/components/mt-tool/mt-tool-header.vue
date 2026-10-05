<template>
  <mt-collapsible-trigger class="mt-tool-header">
    <mt-status-dot
      :variant="TOOL_DOT_VARIANTS[state]"
      :pulse="state === 'input-available'"
      class="mt-tool-header__dot"
    />
    <mt-text as="span" size="xs" weight="medium" class="mt-tool-header__name">{{ name }}</mt-text>
    <mt-badge :variant="TOOL_DOT_VARIANTS[state]">
      {{ t(state) }}
    </mt-badge>
    <mt-icon name="regular-chevron-down-xs" size="10" decorative class="mt-tool-header__chevron" />
  </mt-collapsible-trigger>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtBadge from "@/components/mt-badge/mt-badge.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtStatusDot from "@/components/mt-status-dot/mt-status-dot.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { TOOL_DOT_VARIANTS } from "@/components/_internal/ai-status-dot";
import type { MtToolState } from "@/types/ai";

/**
 * The header of `mt-tool`: the tool's name and the state of the call. It opens and closes the
 * card.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The `type` of the tool part, such as `tool-searchProducts`, or `dynamic-tool`. */
    type: string;
    /** The `state` of the tool part. */
    state: MtToolState;
    /** The `toolName` of a `dynamic-tool` part. */
    toolName?: string;
    /** A readable name, such as "Search products", shown instead of the tool's name. */
    title?: string;
  }>(),
  {
    toolName: undefined,
    title: undefined,
  },
);

const { t } = useI18n({
  messages: {
    en: {
      "input-streaming": "Pending",
      "input-available": "Running",
      "approval-requested": "Awaiting approval",
      "approval-responded": "Responded",
      "output-available": "Completed",
      "output-error": "Error",
      "output-denied": "Denied",
    },
    de: {
      "input-streaming": "Ausstehend",
      "input-available": "Läuft",
      "approval-requested": "Wartet auf Freigabe",
      "approval-responded": "Beantwortet",
      "output-available": "Abgeschlossen",
      "output-error": "Fehler",
      "output-denied": "Abgelehnt",
    },
  },
});

/** The title, the name of a dynamic tool, or the type without its `tool-` prefix. */
const name = computed(() => {
  if (props.title) return props.title;
  if (props.type === "dynamic-tool") return props.toolName ?? "";

  return props.type.replace(/^tool-/, "");
});
</script>

<style scoped>
.mt-tool-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  width: 100%;
  padding: var(--scale-size-8) var(--scale-size-12);
  border-radius: var(--border-radius-m);
  color: var(--color-text-primary-default);
  text-align: start;
  cursor: pointer;
}

.mt-tool-header:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: -2px;
}

.mt-tool-header__dot,
.mt-tool-header__chevron {
  flex-shrink: 0;
  color: var(--color-icon-primary-default);
}

.mt-tool-header__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mt-tool-header__chevron {
  transition: transform 0.15s ease;
}

.mt-tool-header[data-state="open"] .mt-tool-header__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .mt-tool-header__chevron {
    transition: none;
  }
}
</style>
