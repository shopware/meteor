<template>
  <mt-tooltip :content="label" :delay-duration-in-ms="300">
    <template #default="tooltip">
      <mt-button
        v-bind="{ ...tooltip, ...$attrs }"
        variant="tertiary"
        size="small"
        square
        :aria-label="label"
      >
        <template #iconFront>
          <mt-icon :name="icon" size="14" decorative />
        </template>
      </mt-button>
    </template>
  </mt-tooltip>
</template>

<script setup lang="ts">
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";

/**
 * An icon button in `mt-message-actions`, with its label as tooltip and accessible name.
 * Attributes go to the button, so a feedback button can set `aria-pressed`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineOptions({
  inheritAttrs: false,
});

defineProps<{
  /** What the action does, such as "Copy" or "Retry". */
  label: string;
  /** The icon, such as `regular-copy` or `regular-redo`. */
  icon: string;
}>();
</script>
