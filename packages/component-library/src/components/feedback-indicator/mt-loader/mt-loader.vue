<template>
  <div class="mt-loader">
    <div class="mt-loader__container" :style="{ width: size, height: size }">
      <div class="mt-loader-element">
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
        <div :style="{ borderWidth: borderWidth }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: `${string}px`;
  }>(),
  {
    size: "50px",
  },
);

const borderWidth = computed(() => {
  const numericSize = Number(props.size.replace("px", ""));
  const borderWith = Number(numericSize / 12).toPrecision(2);

  return `${borderWith}px`;
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
  background: var(--color-background-primary-disabled);
  opacity: 0.8;
}

.mt-loader-element {
  & div {
    position: absolute;
    width: 100%;
    height: 100%;
    border-width: 4px;
    border-style: solid;
    border-radius: 50%;
    border-color: var(--color-border-brand-selected) transparent transparent transparent;
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
  display: grid;
  grid-auto-columns: auto;
  text-align: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
