<template>
  <div class="component-example">
    <div class="component-example__preview" :style="{ minHeight: height }">
      <component :is="name" v-if="name" />
    </div>
    <div v-if="source" class="component-example__toolbar">
      <button
        type="button"
        class="component-example__toggle"
        @click="showCode = !showCode"
      >
        {{ showCode ? "Hide code" : "Show code" }}
      </button>
    </div>
    <div v-if="showCode && source" class="component-example__code">
      <MDC :value="codeFence" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    /** Name of a globally registered example component, e.g. ExampleButtonVariants */
    name: string;
    /** Minimum height of the preview area */
    height?: string;
  }>(),
  { height: "auto" },
);

const showCode = ref(false);
const source = ref<string>("");

const exampleSources = import.meta.glob("../examples/**/*.vue", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

watchEffect(async () => {
  const entry = Object.entries(exampleSources).find(([path]) =>
    path.endsWith(`/${props.name}.vue`),
  );
  source.value = entry ? await entry[1]() : "";
});

const codeFence = computed(() => "```vue\n" + source.value.trim() + "\n```");
</script>

<style scoped>
.component-example {
  margin: 24px 0;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow: hidden;
}

.component-example__preview {
  padding: var(--scale-size-32) var(--scale-size-24);
  background-color: var(--color-elevation-surface-default);
}

.component-example__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: var(--scale-size-4) var(--scale-size-8);
  border-top: 1px solid var(--color-border-secondary-default);
  background-color: var(--color-background-secondary-default);
}

.component-example__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--scale-size-4) var(--scale-size-8);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-brand-default);
}

.component-example__toggle:hover {
  text-decoration: underline;
}

.component-example__code {
  border-top: 1px solid var(--color-border-secondary-default);
}

.component-example__code :deep(pre) {
  margin: 0;
  border-radius: 0;
}
</style>
