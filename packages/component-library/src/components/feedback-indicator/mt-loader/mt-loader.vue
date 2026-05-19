<template>
  <div class="mt-loader" :class="{ 'mt-loader--has-backdrop': backdrop }">
    <div class="mt-loader__container">
      <div class="mt-loader__element" :style="{ width: size, height: size }">
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
      </div>

      <div v-if="headline || description" class="mt-loader__text">
        <mt-text v-if="headline" as="p" size="s" weight="semibold" class="mt-loader__headline">
          {{ headline }}
        </mt-text>

        <mt-text
          v-if="description"
          as="p"
          size="xs"
          color="color-text-secondary-default"
          class="mt-loader__description"
        >
          {{ description }}
        </mt-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtText from "@/components/content/mt-text/mt-text.vue";

const props = withDefaults(
  defineProps<{
    size?: `${string}px`;
    headline?: string;
    description?: string;
    backdrop?: boolean;
  }>(),
  {
    size: "50px",
    backdrop: true,
  },
);

const borderWidth = computed(() => {
  const numericSize = Number(props.size.replace("px", ""));

  let calculatedWidth;

  // Breakpoints for border width.
  if (numericSize <= 16) {
    calculatedWidth = numericSize / 6;
  } else if (numericSize <= 32) {
    calculatedWidth = numericSize / 8;
  } else {
    calculatedWidth = numericSize / 12;
  }

  return `${calculatedWidth}px`;
});
</script>

<style scoped>
.mt-loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 400;
}

.mt-loader--has-backdrop {
  background: color-mix(in srgb, var(--color-background-tertiary-default) 80%, transparent);
}

.mt-loader__element {
  position: relative;

  & div {
    position: absolute;
    width: 100%;
    height: 100%;
    border-width: 4px;
    border-style: solid;
    border-radius: 50%;
    border-color: var(--color-border-brand-default) transparent transparent transparent;
    animation: mt-loader-rotator 1.4s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &:nth-child(1) {
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
    }

    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
}

.mt-loader__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: var(--scale-size-16);
  width: max-content;
  max-width: 100%;
}

.mt-loader__text {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-2);
  width: 65ch;
  max-width: 100%;
  padding-inline: var(--scale-size-24);
}

.mt-loader__headline,
.mt-loader__description {
  margin: 0;
  overflow-wrap: anywhere;
  text-wrap: pretty;
}

@keyframes mt-loader-rotator {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
