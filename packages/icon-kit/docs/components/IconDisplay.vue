<template>
  <a
    href="#"
    class="IconDisplay"
    :class="mode ? `--mode-${mode}` : null"
    @click.prevent.stop="$emit('select')"
  >
    <div class="IconDisplay_wrap">
      <SwagIcon class="IconDisplay_icon" :icon="icon.name" :type="icon.mode" />
      <span v-if="mode === 'inline'" class="IconDisplay_name">{{
        icon.name
      }}</span>
    </div>
    <span v-if="mode !== 'inline'" class="IconDisplay_name">{{
      icon.name
    }}</span>
  </a>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: Object,
  mode: Object,
});

const id = computed(() => {
  return `meteor-icon-kit__${props.icon.mode}-${props.icon.name}`;
});
</script>

<style lang="scss">
.IconDisplay {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--vp-c-text);
  &_name,
  &_icon {
    color: var(--vp-c-text);
  }
  &_name {
    @apply text-xs font-medium;
  }
  &_wrap {
    @apply bg-[var(--sw-c-gray-50)] flex items-center justify-center;
    width: 100%;
    .dark & {
      @apply bg-[var(--sw-c-gray-dark-700)];
    }
  }
  &.--mode-inline {
    flex-direction: row;
    .IconDisplay_wrap {
      @apply p-4 items-center gap-2;
      justify-content: flex-start;
      --icon-size: 1.725rem;
    }
  }
  &:not(.--mode-inline) {
    .IconDisplay_wrap {
      aspect-ratio: 1;
      --icon-size: 1.5rem;
    }
  }
}
</style>
