<template>
  <ol
    v-if="steps.length"
    class="mt-stepper"
    :class="`mt-stepper--${orientation}`"
    role="list"
    :aria-label="ariaLabel ?? t('ariaLabel')"
  >
    <li
      v-for="(step, index) in stepStates"
      :key="index"
      class="mt-stepper__step"
      :class="{
        'mt-stepper__step--completed': step.isCompleted,
        'mt-stepper__step--current': step.isCurrent,
      }"
      :aria-current="step.isCurrent ? 'step' : undefined"
    >
      <span class="mt-stepper__marker">
        <mt-icon
          :name="step.isCompleted ? 'regular-checkmark-xs' : 'regular-circle-xs'"
          decorative
        />
      </span>

      <span class="mt-stepper__label">
        <span v-if="step.isCompleted" class="mt-stepper__status">{{ t("completed") }}: </span
        >{{ step.label }}
      </span>
    </li>
  </ol>
</template>

<script lang="ts">
export interface StepperStep {
  label: string;
  completed?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtIcon from "../mt-icon/mt-icon.vue";

const props = withDefaults(
  defineProps<{
    /** The steps in order, each with a `label` and an optional `completed`. */
    steps: StepperStep[];
    /** The zero-based index of the current step. Steps before it show as completed. */
    currentStep?: number;
    /** The direction the steps are laid out in. */
    orientation?: "vertical" | "horizontal";
    /** The accessible name of the list of steps. Defaults to a translated "Progress". */
    ariaLabel?: string;
  }>(),
  {
    currentStep: 0,
    orientation: "vertical",
    ariaLabel: undefined,
  },
);

const { t } = useI18n({
  messages: {
    en: {
      ariaLabel: "Progress",
      completed: "Completed",
    },
    de: {
      ariaLabel: "Fortschritt",
      completed: "Abgeschlossen",
    },
  },
});

const stepStates = computed(() =>
  props.steps.map((step, index) => ({
    label: step.label,
    isCurrent: index === props.currentStep,
    isCompleted: step.completed ?? index < props.currentStep,
  })),
);
</script>

<style scoped>
.mt-stepper {
  --mt-stepper-marker-size: var(--scale-size-32);
  --mt-stepper-connector-width: 1px;
  --mt-stepper-connector-offset: calc(
    (var(--mt-stepper-marker-size) - var(--mt-stepper-connector-width)) / 2
  );

  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
}

.mt-stepper--vertical {
  --mt-stepper-gap: var(--scale-size-16);

  display: flex;
  flex-direction: column;
  row-gap: var(--mt-stepper-gap);
}

.mt-stepper--horizontal {
  /* The designed distance between two steps, which is not a step of the size scale */
  --mt-stepper-gap: 50px;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  column-gap: var(--mt-stepper-gap);
}

.mt-stepper__step {
  position: relative;
  display: flex;
  gap: var(--scale-size-8);
  min-width: 0;
  margin: 0;
  padding: 0;
}

.mt-stepper--vertical .mt-stepper__step {
  align-items: flex-start;
}

.mt-stepper--horizontal .mt-stepper__step {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mt-stepper__step:not(:last-child)::after {
  content: "";
  position: absolute;
  border: 0 solid var(--color-border-secondary-default);
}

.mt-stepper--vertical .mt-stepper__step:not(:last-child)::after {
  inset-block: var(--mt-stepper-marker-size) calc(-1 * var(--mt-stepper-gap));
  inset-inline-start: var(--mt-stepper-connector-offset);
  border-inline-start-width: var(--mt-stepper-connector-width);
}

.mt-stepper--horizontal .mt-stepper__step:not(:last-child)::after {
  inset-block-start: var(--mt-stepper-connector-offset);
  inset-inline: calc(50% + var(--mt-stepper-marker-size) / 2)
    calc(var(--mt-stepper-marker-size) / 2 - 50% - var(--mt-stepper-gap));
  border-block-start-width: var(--mt-stepper-connector-width);
}

.mt-stepper__marker {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--mt-stepper-marker-size);
  height: var(--mt-stepper-marker-size);
  border-radius: var(--border-radius-round);
  background: var(--color-background-tertiary-default);
  color: var(--color-icon-primary-disabled);
}

.mt-stepper__step--completed .mt-stepper__marker {
  background: var(--color-background-positive-default);
  color: var(--color-icon-positive-default);
}

.mt-stepper__step--current .mt-stepper__marker {
  background: var(--color-background-brand-default);
  color: var(--color-icon-brand-default);
}

.mt-stepper__label {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.mt-stepper--vertical .mt-stepper__label {
  padding-block: calc((var(--mt-stepper-marker-size) - var(--font-line-height-xs)) / 2);
}

.mt-stepper__status {
  position: absolute;
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  margin: calc(-1 * var(--scale-size-1));
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
