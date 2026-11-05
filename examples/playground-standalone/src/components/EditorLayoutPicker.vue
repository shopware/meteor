<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

// Placeholder content: picking a layout only marks it, the editor doesn't change.
const layouts = [
  { id: "fullWidth", columns: "1fr", count: 1 },
  { id: "sidebarStart", columns: "1fr 2fr", count: 2 },
  { id: "sidebarEnd", columns: "2fr 1fr", count: 2 },
  { id: "twoColumns", columns: "1fr 1fr", count: 2 },
  { id: "threeColumns", columns: "1fr 1fr 1fr", count: 3 },
];
const selectedId = ref("fullWidth");
</script>

<template>
  <aside class="editor-layouts" :aria-label="t('editor.layouts')">
    <button
      v-for="layout in layouts"
      :key="layout.id"
      type="button"
      class="editor-layouts__item"
      :aria-pressed="layout.id === selectedId"
      @click="selectedId = layout.id"
    >
      <span
        class="editor-layouts__preview"
        :style="{ gridTemplateColumns: layout.columns }"
        aria-hidden="true"
      >
        <span class="editor-layouts__header" />
        <span
          v-for="column in layout.count"
          :key="column"
          class="editor-layouts__column"
        />
      </span>
      <mt-text as="span" size="xs">
        {{ t(`editor.layoutNames.${layout.id}`) }}
      </mt-text>
    </button>
  </aside>
</template>

<style scoped>
.editor-layouts {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16) var(--scale-size-12);
}

.editor-layouts__item {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
  padding: var(--scale-size-8);
  text-align: start;
  background: none;
  border: var(--scale-size-1) solid var(--color-border-primary-default);
  border-radius: var(--border-radius-m);
  cursor: pointer;
}

.editor-layouts__item:hover {
  background-color: var(--color-background-secondary-default);
}

/* A thicker brand border, so the preview keeps its contrast. */
.editor-layouts__item[aria-pressed="true"] {
  border-color: var(--color-border-brand-default);
  box-shadow: 0 0 0 var(--scale-size-1) var(--color-border-brand-default);
}

.editor-layouts__item:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.editor-layouts__preview {
  display: grid;
  grid-template-rows: var(--scale-size-12) var(--scale-size-40);
  gap: var(--scale-size-4);
}

.editor-layouts__header {
  grid-column: 1 / -1;
}

.editor-layouts__header,
.editor-layouts__column {
  background-color: var(--color-background-tertiary-default);
  border-radius: var(--border-radius-xs);
}
</style>
