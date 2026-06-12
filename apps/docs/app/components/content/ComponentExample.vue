<template>
  <div class="not-prose my-6 overflow-hidden rounded-lg border border-muted">
    <div
      class="bg-[var(--color-elevation-surface-default)] px-6 py-8"
      :class="layoutClass"
      :style="{ minHeight: height }"
    >
      <component :is="name" v-if="name" />
    </div>

    <div
      v-if="hasCode"
      class="border-t border-muted bg-[var(--color-background-secondary-default)]"
    >
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 p-3 text-sm font-medium text-toned transition hover:bg-[var(--color-interaction-secondary-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary cursor-pointer"
        :aria-expanded="isCodeVisible"
        @click="isCodeVisible = !isCodeVisible"
      >
        <UIcon
          :name="isCodeVisible ? 'i-lucide-chevron-up' : 'i-lucide-code-xml'"
          class="size-4 shrink-0"
        />
        <span>{{ isCodeVisible ? "Hide code" : "Show code" }}</span>
      </button>

      <div
        v-show="isCodeVisible"
        class="border-t border-muted [&_.my-5]:!my-0 [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0"
      >
        <slot v-if="hasCodeOverride" name="code" />
        <MDC
          v-else-if="codeBlock"
          :value="codeBlock"
          :cache-key="`component-example-${name}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Name of a globally registered example component, e.g. ExampleButtonVariants */
    name: string;
    /** Minimum height of the preview area */
    height?: string;
    /** Layout of the preview area */
    layout?: "row" | "column" | "none";
  }>(),
  { height: "auto", layout: "none" },
);

defineSlots<{
  /** Hand-written code block shown instead of the example file source */
  code?(): unknown;
}>();

const hasCodeOverride = !!useSlots().code;
const isCodeVisible = ref(false);

const { data } = hasCodeOverride
  ? { data: ref<{ code: string } | null>(null) }
  : useComponentExampleSource(props.name);

const layoutClass = computed(
  () =>
    ({
      row: "flex flex-wrap items-center gap-3",
      column: "flex flex-col gap-3",
      none: "",
    })[props.layout],
);

const hasCode = computed(() => hasCodeOverride || !!data.value?.code);

const codeBlock = computed(() =>
  data.value?.code ? fencedCode(data.value.code) : "",
);

watch(
  () => props.name,
  () => {
    isCodeVisible.value = false;
  },
);

function fencedCode(code: string) {
  const longestBacktickRun = Math.max(
    0,
    ...Array.from(code.matchAll(/`+/g), ([match]) => match.length),
  );
  const fence = "`".repeat(Math.max(3, longestBacktickRun + 1));

  return `${fence}vue\n${code}\n${fence}`;
}
</script>
