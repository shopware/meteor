<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  to: string;
}>();
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col overflow-hidden rounded-2xl border border-default bg-muted transition-colors hover:border-accented"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none relative h-40 overflow-hidden border-b border-default bg-default"
    >
      <slot name="visual" />
    </div>

    <div
      class="flex flex-1 flex-col gap-1.5 p-5 transition-colors group-hover:bg-muted"
    >
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-highlighted">{{ title }}</h3>
        <UIcon
          name="i-lucide-arrow-right"
          class="ml-auto size-4 text-dimmed transition-transform group-hover:translate-x-0.5 group-hover:text-highlighted"
        />
      </div>
      <p class="text-sm leading-relaxed text-muted">{{ description }}</p>
    </div>
  </NuxtLink>
</template>
