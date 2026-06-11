<template>
  <div class="not-prose my-6 overflow-hidden rounded-lg border border-muted">
    <div
      class="bg-[var(--color-elevation-surface-default)] px-6 py-8"
      :style="{ minHeight: height }"
    >
      <component :is="name" v-if="name" />
    </div>

    <div
      v-if="source"
      class="border-t border-muted bg-[var(--color-background-secondary-default)]"
    >
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 p-3 text-sm font-medium text-toned transition hover:bg-[var(--color-interaction-secondary-hover)] active:bg-[var(--color-interaction-secondary-pressed)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary cursor-pointer"
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
        v-if="isCodeVisible"
        class="border-t border-muted [&_.my-5]:!my-0 [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0"
      >
        <MDC :value="codeBlock" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    /** Name of a globally registered example component, e.g. ExampleButtonVariants */
    name: string;
    /** Minimum height of the preview area */
    height?: string;
  }>(),
  { height: "auto" },
);

const source = ref<string>("");
const isCodeVisible = ref(false);

const exampleSources = import.meta.glob("../examples/**/*.vue", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

watchEffect(async (onCleanup) => {
  let cancelled = false;
  onCleanup(() => {
    cancelled = true;
  });

  const entry = Object.entries(exampleSources).find(([path]) =>
    path.endsWith(`/${props.name}.vue`),
  );

  const nextSource = entry ? await entry[1]() : "";
  if (!cancelled) {
    source.value = nextSource;
  }
});

watch(
  () => props.name,
  () => {
    isCodeVisible.value = false;
  },
);

const codeBlock = computed(() => {
  const trimmedSource = cleanExampleSource(source.value);
  if (!trimmedSource) return "";

  return fencedCode(trimmedSource);
});

function cleanExampleSource(code: string) {
  return stripDemoAttributes(stripStyleBlocks(stripScriptImports(code)))
    .replace(/\n[ \t]+\n/g, "\n")
    .replace(/<([A-Za-z][\w:-]*)\s*\n\s*>/g, "<$1>")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripStyleBlocks(code: string) {
  return code.replace(/\n?<style\b[^>]*>[\s\S]*?<\/style>\s*/g, "\n");
}

function stripScriptImports(code: string) {
  return code.replace(
    /<script setup([^>]*)>([\s\S]*?)<\/script>/g,
    (_match, attrs: string, script: string) => {
      const cleanedScript = removeMeteorImportStatements(script)
        .replace(/^\s+|\s+$/g, "")
        .trim();

      return cleanedScript
        ? `<script setup${attrs}>\n${cleanedScript}\n${"</" + "script>"}`
        : "";
    },
  );
}

function removeMeteorImportStatements(script: string) {
  const lines = script.split("\n");
  const cleanedLines: string[] = [];
  let importLines: string[] | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (importLines) {
      importLines.push(line);

      if (/;\s*$/.test(trimmedLine)) {
        if (!isMeteorComponentImport(importLines.join("\n"))) {
          cleanedLines.push(...importLines);
        }
        importLines = null;
      }
      continue;
    }

    if (trimmedLine.startsWith("import ")) {
      importLines = [line];
      if (/;\s*$/.test(trimmedLine)) {
        if (!isMeteorComponentImport(line)) {
          cleanedLines.push(line);
        }
        importLines = null;
      }
      continue;
    }

    cleanedLines.push(line);
  }

  if (importLines && !isMeteorComponentImport(importLines.join("\n"))) {
    cleanedLines.push(...importLines);
  }

  return cleanedLines.join("\n");
}

function isMeteorComponentImport(statement: string) {
  return /from\s+["']@shopware-ag\/meteor-component-library(?:\/[^"']*)?["']/.test(
    statement,
  );
}

function stripDemoAttributes(code: string) {
  return code
    .replace(/\sclass="example-[^"]*"/g, "")
    .replace(/\sstyle="[\s\S]*?"/g, "");
}

function fencedCode(code: string) {
  const longestBacktickRun = Math.max(
    0,
    ...Array.from(code.matchAll(/`+/g), ([match]) => match.length),
  );
  const fence = "`".repeat(Math.max(3, longestBacktickRun + 1));

  return `${fence}vue\n${code}\n${fence}`;
}
</script>
