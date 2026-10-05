<template>
  <div v-if="hasOutput" class="mt-tool-output">
    <mt-text size="xs" weight="semibold" color="color-text-secondary-default">
      {{ errorText ? t("error") : t("result") }}
    </mt-text>

    <mt-text v-if="errorText" size="xs" color="color-text-critical-default">
      {{ errorText }}
    </mt-text>
    <slot v-else>
      <mt-code-block
        :code="typeof output === 'string' ? output : JSON.stringify(output, null, 2)"
        :language="typeof output === 'string' ? undefined : 'json'"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtCodeBlock from "@/components/_internal/mt-code-block.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { hasSlotContent } from "@/utils/slot";

/**
 * The result or the error of a tool call, inside `mt-tool-content`. A result shows as JSON or
 * text unless the default slot renders it, for example as a table. It shows nothing until there is
 * a result or an error.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The `output` of the tool part. */
    output?: unknown;
    /** The `errorText` of the tool part. */
    errorText?: string;
  }>(),
  {
    output: undefined,
    errorText: undefined,
  },
);

const slots = defineSlots<{
  /** A custom rendering of the result, instead of JSON. */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { result: "Result", error: "Error" },
    de: { result: "Ergebnis", error: "Fehler" },
  },
});

const hasOutput = computed(
  () =>
    Boolean(props.errorText) ||
    (props.output !== undefined && props.output !== null) ||
    hasSlotContent(slots.default),
);
</script>

<style scoped>
.mt-tool-output {
  display: grid;
  gap: var(--scale-size-4);
}
</style>
