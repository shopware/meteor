<template>
  <mt-tooltip :content="summary" :delay-duration-in-ms="0" :hide-delay-duration-in-ms="0">
    <template #default="tooltip">
      <mt-button
        v-bind="{ ...tooltip, ...$attrs }"
        variant="tertiary"
        square
        class="mt-context-usage"
        :aria-label="label ?? t('label')"
      >
        <template #iconFront>
          <mt-progress-ring :value="percent" :variant="variant" />
        </template>
      </mt-button>
    </template>
  </mt-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";
import MtProgressRing from "./_internal/mt-progress-ring.vue";

/**
 * How much of a model's context window is used, as a small ring in a button with the token counts
 * in a tooltip. It turns to the attention color at 80% and to the critical color at 95%.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** The tokens used so far. */
    used: number;
    /** The size of the context window in tokens. */
    total: number;
    /** The accessible name. Defaults to a translated "Context usage". */
    label?: string;
  }>(),
  {
    label: undefined,
  },
);

const { t, locale } = useI18n({
  messages: {
    en: {
      label: "Context usage",
      summary: "{used} of {total} tokens used ({percent}%)",
    },
    de: {
      label: "Kontextnutzung",
      summary: "{used} von {total} Tokens genutzt ({percent} %)",
    },
  },
});

const percent = computed(() =>
  props.total > 0 ? Math.min(100, Math.max(0, (props.used / props.total) * 100)) : 0,
);

const variant = computed(() =>
  percent.value >= 95 ? "critical" : percent.value >= 80 ? "attention" : "default",
);

const summary = computed(() => {
  const format = new Intl.NumberFormat(locale.value, {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return t("summary", {
    used: format.format(props.used),
    total: format.format(props.total),
    percent: Math.round(percent.value),
  });
});
</script>
