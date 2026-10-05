<template>
  <div v-if="input !== undefined" class="mt-tool-input">
    <mt-text size="xs" weight="semibold" color="color-text-secondary-default">
      {{ t("parameters") }}
    </mt-text>
    <mt-code-block :code="JSON.stringify(input, null, 2)" language="json" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtCodeBlock from "@/components/_internal/mt-code-block.vue";
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * The input of a tool call as JSON, inside `mt-tool-content`. It shows nothing until there is an
 * input.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineProps<{
  /** The `input` of the tool part. */
  input?: unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { parameters: "Parameters" },
    de: { parameters: "Parameter" },
  },
});
</script>

<style scoped>
.mt-tool-input {
  display: grid;
  gap: var(--scale-size-4);
}
</style>
