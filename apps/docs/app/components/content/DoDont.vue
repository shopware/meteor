<template>
  <div class="not-prose my-6 grid gap-4 sm:grid-cols-2">
    <div
      class="rounded-md border border-[var(--color-border-positive-default)] bg-[var(--color-background-positive-default)] p-4"
    >
      <p
        class="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-positive-default)]"
      >
        <UIcon name="i-lucide-circle-check" class="size-4 shrink-0" />
        <span>Do</span>
      </p>
      <div :class="contentClass">
        <MDCSlot v-if="$slots.do" :use="$slots.do" />
        <ul v-else-if="doItems?.length" class="m-0 list-disc space-y-1 pl-5">
          <li v-for="item in doItems" :key="item">
            {{ item }}
          </li>
        </ul>
        <p v-else class="m-0">
          {{ doText }}
        </p>
      </div>
    </div>

    <div
      class="rounded-md border border-[var(--color-border-critical-default)] bg-[var(--color-background-critical-default)] p-4"
    >
      <p
        class="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-critical-default)]"
      >
        <UIcon name="i-lucide-circle-x" class="size-4 shrink-0" />
        <span>Don't</span>
      </p>
      <div :class="contentClass">
        <MDCSlot v-if="$slots.dont" :use="$slots.dont" />
        <ul v-else-if="dontItems?.length" class="m-0 list-disc space-y-1 pl-5">
          <li v-for="item in dontItems" :key="item">
            {{ item }}
          </li>
        </ul>
        <p v-else class="m-0">
          {{ dont }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Short text for the Do card. Use the #do slot for rich content. */
  doText?: string;
  /** List items for the Do card. Use the #do slot when items need rich Markdown. */
  doItems?: string[];
  /** Short text for the Don't card. Use the #dont slot for rich content. */
  dont?: string;
  /** List items for the Don't card. Use the #dont slot when items need rich Markdown. */
  dontItems?: string[];
}>();

const contentClass =
  "text-base leading-7 text-default [&_code]:rounded [&_code]:bg-[var(--color-background-secondary-default)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.875em] [&_li]:pl-1 [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5";
</script>
