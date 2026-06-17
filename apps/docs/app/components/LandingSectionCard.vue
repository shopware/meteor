<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon: string;
  to: string;
}>();
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col overflow-hidden rounded-2xl border border-default bg-default transition-colors hover:border-accented"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none relative h-40 overflow-hidden border-b border-default bg-muted"
    >
      <slot name="visual" />
    </div>

    <div class="flex flex-1 flex-col gap-1.5 p-5">
      <div class="flex items-center gap-2">
        <UIcon :name="icon" class="size-5 shrink-0 text-primary" />
        <h3 class="font-semibold text-highlighted">{{ title }}</h3>
        <UIcon
          name="i-lucide-arrow-right"
          class="ml-auto size-4 text-dimmed transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
      <p class="text-sm leading-relaxed text-muted">{{ description }}</p>
    </div>
  </NuxtLink>
</template>
