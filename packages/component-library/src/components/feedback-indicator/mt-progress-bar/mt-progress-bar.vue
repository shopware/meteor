<template>
  <div
    class="mt-progress-bar"
    role="progressbar"
    :aria-valuenow="model"
    :aria-valuemax="maxValue"
    aria-label="Current progress"
  >
    <mt-field-label id="some-id" :style="{ gridArea: 'label' }">{{ label }}</mt-field-label>

    <mt-text class="mt-progress-bar__progress-label" as="span" size="xs">
      {{ progressLabel }}
    </mt-text>

    <div class="mt-progress-bar__track">
      <div
        :class="['mt-progress-bar__fill', { 'mt-progress-bar__fill--with-error': !!error }]"
        :style="{ width: fillWidth }"
      ></div>
    </div>

    <mt-field-error v-if="error" :error="error" :style="{ marginTop: 0, gridArea: 'error' }" />
  </div>
</template>

<script setup lang="ts">
import MtFieldLabel from "@/components/form/_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "@/components/form/_internal/mt-field-error/mt-field-error.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { computed } from "vue";

const model = defineModel<number>();

const props = withDefaults(
  defineProps<{
    label: string;
    maxValue: number;
    error?: { detail: string; code: number } | null;
    progressLabelType?: string;
  }>(),
  {
    progressLabelType: "percent",
  },
);

const progressLabel = computed<string>(() => {
  if (props.progressLabelType === "percent") return fillWidth.value;

  return `${model.value} ${props.progressLabelType} / ${props.maxValue} ${props.progressLabelType}`;
});

const fillWidth = computed<`${string}%`>(() => {
  if (!model.value) return "0%";

  const percentage = Math.floor((model.value / props.maxValue) * 100);
  if (percentage > 100) return "100%";
  if (percentage < 0) return "0%";

  return `${percentage}%`;
});
</script>

<style scoped>
.mt-progress-bar {
  display: grid;
  grid-template-areas:
    "label progress"
    "track track"
    "error error";
  row-gap: var(--scale-size-8);
}

.mt-progress-bar__progress-label {
  color: var(--color-text-secondary);
  grid-area: progress;
  justify-self: end;
}

.mt-progress-bar__track {
  border-radius: var(--border-radius-round);
  height: var(--scale-size-8);
  width: 100%;
  background: var(--color-background-primary-disabled);
  grid-area: track;
}

.mt-progress-bar__fill {
  border-radius: var(--border-radius-round);
  height: 100%;
  background: var(--color-interaction-primary-default);
}

.mt-progress-bar__fill--with-error {
  background: var(--color-interaction-critical-default);
}
</style>
