<template>
  <div class="not-prose my-6 flex flex-col gap-4 md:flex-row">
    <div
      v-for="theme in ['light', 'dark']"
      :key="theme"
      :data-theme="theme"
      class="flex flex-1 flex-col items-center px-4 py-6"
    >
      <div class="relative h-[260px] w-[340px] max-w-full">
        <div
          class="absolute left-0 top-0 flex size-[260px] items-center justify-center [perspective:800px]"
        >
          <div
            v-for="surface in surfaces"
            :key="surface.token"
            class="absolute size-40 rounded-xl border border-muted [transform-style:preserve-3d] [transform:rotateX(45deg)_rotateZ(-45deg)]"
            :style="{
              background: `var(${surface.token})`,
              bottom: surface.bottom,
            }"
          />
        </div>
        <span
          class="absolute bottom-0 left-0 w-[260px] text-center text-xs text-[var(--color-static-black)]"
        >
          {{ theme === "dark" ? "Dark mode" : "Light mode" }}
        </span>
        <div
          v-for="surface in surfaces"
          :key="surface.token + '-legend'"
          class="absolute left-64 flex -translate-y-1/2 items-center"
          :style="{ top: surface.centerY + 'px' }"
        >
          <div class="size-[5px] shrink-0 rounded-full bg-[#e0e0e0]" />
          <div class="h-px w-6 shrink-0 bg-[#e0e0e0]" />
          <span
            class="whitespace-nowrap pl-1.5 text-xs font-medium text-[var(--color-static-black)]"
          >
            {{ surface.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// centerY = CONTAINER_SIZE - (bottomPct * CONTAINER_SIZE) - CARD_SIZE / 2
const surfaces = [
  {
    token: "--color-elevation-surface-sunken",
    label: "Sunken",
    bottom: "18%",
    centerY: 133,
  },
  {
    token: "--color-elevation-surface-default",
    label: "Default",
    bottom: "30%",
    centerY: 102,
  },
  {
    token: "--color-elevation-surface-raised",
    label: "Raised",
    bottom: "42%",
    centerY: 71,
  },
];
</script>
