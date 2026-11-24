<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
} from "@shopware-ag/meteor-component-library";

export interface GridColumn {
  /** Identifies the column. */
  key: string;
  label: string;
  align?: "start" | "end" | "center";
  /** A CSS width, such as "12rem". Columns without one share the remaining space. */
  width?: string;
}

/**
 * A table in the shape of the Administration's data grid whose rows are skeletons: the column
 * headers are real, and each row of the data shows as placeholder bars, so a page has the layout
 * of a list without its content.
 */
const props = withDefaults(
  defineProps<{
    columns: GridColumn[];
    /** The rows of the page. Only their number matters: each one shows as a skeleton row. */
    rows: readonly unknown[];
    caption: string;
    /** Shows skeleton rows while the first rows load, so the table keeps its height. */
    isLoading?: boolean;
    /** Adds the checkbox column in front of the rows. */
    selectable?: boolean;
    /** Adds the row menu column after the rows. */
    actions?: boolean;
    /** The number of skeleton rows while loading. */
    skeletonRows?: number;
    /** Leaves out the column menus and the settings button, for small grids inside cards. */
    plain?: boolean;
  }>(),
  {
    isLoading: false,
    selectable: false,
    actions: false,
    skeletonRows: 8,
    plain: false,
  },
);

defineSlots<{
  empty?: () => unknown;
}>();

const { t } = useI18n();

/** The columns the user hid with the column menu. */
const hiddenColumns = ref<string[]>([]);

const visibleColumns = computed(() =>
  props.columns.filter((column) => !hiddenColumns.value.includes(column.key)),
);

const rowCount = computed(() =>
  props.isLoading ? props.skeletonRows : props.rows.length,
);

/** A different bar length per cell, so the rows look like text of varying length. */
function barWidth(row: number, column: number) {
  return `${45 + ((row * 7 + column * 13) % 40)}%`;
}
</script>

<template>
  <div class="app-grid" :class="{ 'app-grid--plain': plain }">
    <table class="app-grid__table" aria-busy="true">
      <caption class="visually-hidden">
        {{ caption }}
      </caption>

      <colgroup>
        <col v-if="selectable" class="app-grid__col-fixed" />
        <col
          v-for="column in visibleColumns"
          :key="column.key"
          :style="column.width ? { width: column.width } : undefined"
        />
        <col v-if="actions" class="app-grid__col-fixed" />
      </colgroup>

      <thead>
        <tr>
          <th v-if="selectable" class="app-grid__fixed" scope="col">
            <span class="app-grid__checkbox" />
          </th>

          <th
            v-for="(column, index) in visibleColumns"
            :key="column.key"
            scope="col"
            :class="`app-grid__cell--${column.align ?? 'start'}`"
          >
            <div class="app-grid__header">
              <span>{{ column.label }}</span>

              <mt-dropdown-menu-root v-if="!plain">
                <mt-dropdown-menu-trigger as-child>
                  <button
                    type="button"
                    class="app-grid__column-menu"
                    :aria-label="t('grid.columnActions', { column: column.label })"
                  >
                    <mt-icon
                      name="solid-ellipsis-h-s"
                      size="var(--scale-size-10)"
                      decorative
                    />
                  </button>
                </mt-dropdown-menu-trigger>
                <mt-dropdown-menu-portal>
                  <mt-action-menu>
                    <mt-action-menu-item
                      icon="regular-eye-slash"
                      :disabled="index === 0"
                      @select="hiddenColumns = [...hiddenColumns, column.key]"
                    >
                      {{ t("grid.hideColumn") }}
                    </mt-action-menu-item>
                  </mt-action-menu>
                </mt-dropdown-menu-portal>
              </mt-dropdown-menu-root>
            </div>
          </th>

          <th v-if="actions" class="app-grid__fixed" scope="col">
            <mt-dropdown-menu-root v-if="!plain">
              <mt-dropdown-menu-trigger as-child>
                <mt-button
                  variant="secondary"
                  size="x-small"
                  square
                  :aria-label="t('grid.settings')"
                >
                  <mt-icon name="regular-bars-s" size="var(--scale-size-12)" decorative />
                </mt-button>
              </mt-dropdown-menu-trigger>
              <mt-dropdown-menu-portal>
                <mt-action-menu>
                  <mt-action-menu-item
                    icon="regular-eye"
                    :disabled="hiddenColumns.length === 0"
                    @select="hiddenColumns = []"
                  >
                    {{ t("grid.showAllColumns") }}
                  </mt-action-menu-item>
                </mt-action-menu>
              </mt-dropdown-menu-portal>
            </mt-dropdown-menu-root>
            <span v-else class="visually-hidden">{{ t("grid.actions") }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rowCount" :key="row">
          <td v-if="selectable" class="app-grid__fixed">
            <span class="app-grid__checkbox" />
          </td>
          <td
            v-for="(column, index) in visibleColumns"
            :key="column.key"
            :class="`app-grid__cell--${column.align ?? 'start'}`"
          >
            <span
              class="app-grid__skeleton"
              :style="{ width: barWidth(row, index) }"
            />
          </td>
          <td v-if="actions" class="app-grid__fixed">
            <span class="app-grid__skeleton app-grid__skeleton--menu" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!isLoading && rows.length === 0" class="app-grid__empty">
      <slot name="empty" />
    </div>
  </div>
</template>

<style scoped>
.app-grid {
  position: relative;
  min-width: 0;
  overflow-x: auto;
  background-color: var(--color-elevation-surface-default);
}

.app-grid__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.app-grid__col-fixed {
  width: 5.5rem;
}

th,
td {
  height: 2.625rem;
  padding: 0 var(--scale-size-20);
  text-align: start;
  vertical-align: middle;
  white-space: nowrap;
  background-color: var(--color-elevation-surface-default);
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

th:last-child,
td:last-child {
  border-inline-end: 0;
}

th {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  height: var(--scale-size-64);
  font-weight: var(--font-weight-semibold);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.app-grid--plain th {
  height: var(--scale-size-48);
}

/* The label and the column menu: the menu after a label at the start, before one at the end. */
.app-grid__header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}

.app-grid__cell--end .app-grid__header {
  flex-direction: row-reverse;
}

.app-grid__cell--center .app-grid__header {
  justify-content: center;
}

.app-grid__column-menu {
  display: inline-grid;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  padding: 0;
  color: var(--color-icon-secondary-default);
  background: none;
  border: 0;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.app-grid__column-menu:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.app-grid__column-menu:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.app-grid__fixed {
  width: 5.5rem;
  min-width: 5.5rem;
  padding: 0;
  text-align: center;
}

/* The outline of a checkbox, in the selection column. */
.app-grid__checkbox {
  display: inline-block;
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  vertical-align: middle;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-checkbox, var(--border-radius-2xs));
}

tbody tr:nth-child(even) td {
  background-color: var(--color-elevation-surface-sunken);
}

/* A still placeholder bar, in the color and shape of mt-skeleton-bar without its shimmer. */
.app-grid__skeleton {
  display: block;
  height: var(--scale-size-12);
  background-color: var(--color-background-tertiary-default);
  border-radius: var(--border-radius-xs);
}

.app-grid__cell--end .app-grid__skeleton {
  margin-inline-start: auto;
}

.app-grid__cell--center .app-grid__skeleton {
  margin-inline: auto;
}

.app-grid__skeleton--menu {
  width: var(--scale-size-24);
  margin-inline: auto;
}

.app-grid__empty {
  padding: var(--scale-size-48) var(--scale-size-16);
}
</style>
