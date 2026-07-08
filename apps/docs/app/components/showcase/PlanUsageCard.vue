<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtProgressBar from "@shopware-ag/meteor-component-library/MtProgressBar";
import MtHelpText from "@shopware-ag/meteor-component-library/MtHelpText";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";

const sessionUsage = ref(75);
const weeklyUsage = ref(14);
const thinkingMode = ref(true);
const structuredOutput = ref(false);
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card>
    <div class="stack">
      <div class="section">
        <div class="inline-start">
          <mt-text size="s" weight="semibold">Plan usage limits</mt-text>
          <mt-help-text
            text="Usage counts toward your session and weekly limits, which reset at the start of each cycle."
          />
        </div>
        <div class="usage-item">
          <mt-progress-bar
            v-model="sessionUsage"
            :max-value="100"
            label="Session usage"
          />
          <mt-text size="xs" :color="muted">Resets in 0h 53min</mt-text>
        </div>
        <div class="usage-item">
          <mt-progress-bar
            v-model="weeklyUsage"
            :max-value="100"
            label="Weekly usage"
          />
          <mt-text size="xs" :color="muted"
            >Resets Monday, 14th at 6:44pm</mt-text
          >
        </div>
      </div>
      <div class="section">
        <mt-text size="s" weight="semibold">Model settings</mt-text>
        <div class="stack-sm">
          <mt-switch v-model="thinkingMode" label="Thinking mode" />
          <mt-switch v-model="structuredOutput" label="Structured output" />
        </div>
        <mt-text size="2xs" :color="muted">
          The usage pricing is calculated according to your free monthly plan
          credits. If the plan limits are reached, additional costs might occur.
        </mt-text>
      </div>
    </div>
  </mt-card>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}
/* A titled section: a 16px-gap column holding a headline and its items. */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
/* A cohesive group of toggles. */
.stack-sm {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}
/* A progress bar with its reset/caption text tucked directly beneath it. */
.usage-item {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}
/* Headline + its help-text tooltip. */
.inline-start {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}
/* A non-bordered MtSwitch reserves a 48px min-height; drop it so the toggles
   sit at their natural compact height. */
:deep(.mt-switch--not-bordered) {
  min-height: 0;
}
</style>
