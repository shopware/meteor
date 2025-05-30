<template>
  <mt-tooltip
    :content="text"
    :placement="placement"
    :max-width="width"
    :delay-duration-in-ms="showDelay"
    :hide-delay-duration-in-ms="hideDelay"
  >
    <template #default="props">
      <button type="button" v-bind="{ ...props, ...$attrs }" class="mt-help-text">
        <mt-icon
          aria-hidden="true"
          data-testid="mt-help-text__icon"
          name="solid-question-circle-s"
        />
      </button>
    </template>
  </mt-tooltip>
</template>

<script setup lang="ts">
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtTooltip, { type Placement } from "@/components/overlay/mt-tooltip/mt-tooltip.vue";

withDefaults(
  defineProps<{
    text: string;
    width?: number;
    showDelay?: number;
    hideDelay?: number;
    placement?: Placement;
  }>(),
  {
    showDelay: 0,
    hideDelay: 150,
  },
);
</script>

<style scoped>
.mt-help-text {
  color: var(--color-icon-brand-default);
  display: inline-flex;
  align-items: center;
  height: var(--scale-size-16);
  width: var(--scale-size-16);
  justify-content: center;
  position: relative;
  border-radius: var(--border-radius-round);

  &:focus-visible {
    outline-offset: 0.25rem;
    outline: 2px solid var(--color-border-brand-selected);
  }

  &:where(:hover, :focus-visible) {
    color: var(--color-icon-brand-hover);
  }
}

.mt-help-text::after {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  scale: 0.9;
  background-color: var(--color-icon-static-default);
  z-index: -1;
  border-radius: var(--border-radius-round);
}

.mt-help-text__tooltip-text {
  display: none;
}
</style>
