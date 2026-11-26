<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtSelect, MtText } from "@shopware-ag/meteor-component-library";

/**
 * The footer of a list, as below the Administration's grids: the page numbers in the middle, with
 * an ellipsis for the skipped ones, and the page size at the end.
 */
const props = defineProps<{
  total: number;
}>();

const page = defineModel<number>("page", { required: true });
const limit = defineModel<number>("limit", { required: true });

const { t } = useI18n();

const limitOptions = [10, 25, 50, 75, 100].map((value) => ({
  value,
  label: String(value),
}));

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.total / limit.value)),
);

/** Up to seven entries: the first and last three pages, or the pages around the current one. */
const pages = computed<(number | "gap")[]>(() => {
  const count = pageCount.value;
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);

  const current = page.value;

  if (current <= 3 || current >= count - 2) {
    return [1, 2, 3, "gap", count - 2, count - 1, count];
  }

  return [1, "gap", current - 1, current, current + 1, "gap", count];
});
</script>

<template>
  <nav class="app-pagination" :aria-label="t('grid.pagination')">
    <ol class="app-pagination__pages">
      <li v-for="(entry, index) in pages" :key="`${entry}-${index}`">
        <span v-if="entry === 'gap'" class="app-pagination__gap">…</span>
        <button
          v-else
          type="button"
          class="app-pagination__page"
          :class="{ 'is--active': entry === page }"
          :aria-current="entry === page ? 'page' : undefined"
          @click="page = entry"
        >
          {{ entry }}
        </button>
      </li>
    </ol>

    <div class="app-pagination__limit">
      <mt-text size="xs">{{ t("grid.perPage") }}</mt-text>
      <mt-select
        v-model="limit"
        class="app-pagination__select"
        :aria-label="t('grid.perPage')"
        :options="limitOptions"
        :enable-search="false"
        hide-clearable-button
        small
      />
    </div>
  </nav>
</template>

<style scoped>
.app-pagination {
  position: sticky;
  inset-block-end: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--scale-size-16);
  min-height: var(--scale-size-64);
  padding: var(--scale-size-12) var(--scale-size-32);
  background-color: var(--color-elevation-surface-default);
  border-block-start: 1px solid var(--color-border-secondary-default);
}

.app-pagination__pages {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-pagination__page,
.app-pagination__gap {
  display: inline-grid;
  place-items: center;
  min-width: var(--scale-size-32);
  height: var(--scale-size-36);
  padding-inline: var(--scale-size-8);
  font: inherit;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.app-pagination__page {
  background: none;
  border: 0;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.app-pagination__page:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.app-pagination__page.is--active {
  font-weight: var(--font-weight-semibold);
  color: var(--color-static-white);
  background-color: var(--color-interaction-primary-default);
}

.app-pagination__page:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.app-pagination__limit {
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-12);
}

.app-pagination__select {
  width: 6rem;
}

.app-pagination__select :deep(.mt-field) {
  margin: 0;
}

@media (max-width: 720px) {
  .app-pagination {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .app-pagination__pages,
  .app-pagination__limit {
    grid-column: 1;
  }
}
</style>
