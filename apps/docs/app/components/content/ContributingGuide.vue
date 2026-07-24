<script setup lang="ts">
// Render the repository's root CONTRIBUTING.md so the guide is maintained in
// one place. Imported raw, parsed to MDC, and rendered as markdown.
import contributing from "../../../../../CONTRIBUTING.md?raw";

const { data: ast } = await useAsyncData("contributing-guide", () =>
  cachedParseMarkdown(contributing as string),
);
</script>

<template>
  <MDCRenderer
    v-if="ast"
    :body="(ast as any).body"
    :data="(ast as any).data"
  />
</template>
