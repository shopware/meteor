<template>
  <mt-icon :name="icon" size="14" decorative class="mt-checkpoint-icon" />
</template>

<script setup lang="ts">
import MtIcon from "@/components/mt-icon/mt-icon.vue";

/**
 * The icon of `mt-checkpoint`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The icon, such as `regular-sync` for a switched model. */
    icon?: string;
  }>(),
  {
    icon: "regular-bookmark",
  },
);
</script>

<style scoped>
.mt-checkpoint-icon {
  color: var(--color-icon-primary-default);
}
</style>
