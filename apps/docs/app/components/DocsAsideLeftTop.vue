<script setup lang="ts">
// Filter input above the sidebar. Overrides Docus' default DocsAsideLeftTop
// (which would render section anchor links). The query is shared with
// DocsAsideLeftBody, which does the actual filtering.
const query = useSidebarFilter();
const input = useTemplateRef("input");

// Press "f" to focus the filter (ignored while typing in another field).
defineShortcuts({
  f: () => input.value?.inputRef?.focus(),
});
</script>

<template>
  <UInput
    ref="input"
    v-model="query"
    placeholder="Filter..."
    aria-label="Filter navigation"
    autocomplete="off"
    variant="outline"
    class="mb-5 w-full"
  >
    <template #trailing>
      <UKbd value="f" />
    </template>
  </UInput>
</template>
