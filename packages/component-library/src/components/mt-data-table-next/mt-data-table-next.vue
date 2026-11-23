<template>
  <div class="mt-data-table-next" v-bind="rootAttrs">
    <mt-table
      class="mt-data-table-next__table"
      :class="{ 'mt-data-table-next__table--has-rows': !loading && rows.length > 0 }"
      v-bind="tableAttrs"
      :aria-busy="loading ? 'true' : undefined"
    >
      <mt-table-header>
        <mt-table-row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <mt-table-header-cell
            v-for="header in headerGroup.headers"
            :key="header.id"
            scope="col"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :align="getAlign(header.column)"
            :aria-sort="getAriaSort(header.column)"
            :class="{
              'mt-data-table-next__selection-cell': header.column.id === SELECTION_COLUMN_ID,
            }"
          >
            <mt-checkbox
              v-if="header.column.id === SELECTION_COLUMN_ID"
              :model-value="isAllPageRowsSelected"
              :partial="isSomePageRowsSelected && !isAllPageRowsSelected"
              :disabled="loading || rows.length === 0"
              :aria-label="t('selectAllRows')"
              @update:model-value="(value: boolean) => table.toggleAllPageRowsSelected(value)"
            />

            <template v-else-if="!header.isPlaceholder">
              <button
                v-if="header.column.getCanSort()"
                type="button"
                class="mt-data-table-next__sort-button"
                @click="header.column.toggleSorting()"
              >
                <slot :name="`header-${header.column.id}`" :header="header" :column="header.column">
                  <FlexRender :header="header" />
                </slot>

                <mt-icon
                  class="mt-data-table-next__sort-icon"
                  :class="{
                    'mt-data-table-next__sort-icon--active': !!header.column.getIsSorted(),
                  }"
                  :name="getSortIconName(header.column)"
                  size="var(--scale-size-12)"
                  decorative
                />
              </button>

              <slot
                v-else
                :name="`header-${header.column.id}`"
                :header="header"
                :column="header.column"
              >
                <FlexRender :header="header" />
              </slot>
            </template>
          </mt-table-header-cell>
        </mt-table-row>
      </mt-table-header>

      <mt-table-body>
        <template v-if="loading">
          <mt-table-row v-for="index in skeletonRowCount" :key="`skeleton-${index}`">
            <mt-table-cell
              v-for="column in leafColumns"
              :key="column.id"
              :class="{ 'mt-data-table-next__selection-cell': column.id === SELECTION_COLUMN_ID }"
            >
              <mt-skeleton-bar
                v-if="column.id !== SELECTION_COLUMN_ID"
                class="mt-data-table-next__skeleton"
              />
            </mt-table-cell>
          </mt-table-row>
        </template>

        <mt-table-row v-else-if="rows.length === 0">
          <mt-table-cell
            :colspan="leafColumns.length"
            align="center"
            class="mt-data-table-next__empty"
          >
            <slot name="empty">
              {{ t("noResults") }}
            </slot>
          </mt-table-cell>
        </mt-table-row>

        <template v-else>
          <mt-table-row
            v-for="row in rows"
            :key="row.id"
            :selected="isSelectionEnabled && row.getIsSelected()"
            :class="{ 'mt-data-table-next__row--selectable': isSelectionEnabled }"
          >
            <mt-table-cell
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :align="getAlign(cell.column)"
              :class="{
                'mt-data-table-next__selection-cell': cell.column.id === SELECTION_COLUMN_ID,
              }"
            >
              <mt-checkbox
                v-if="cell.column.id === SELECTION_COLUMN_ID"
                :model-value="row.getIsSelected()"
                :disabled="!row.getCanSelect()"
                :aria-label="t('selectRow')"
                @update:model-value="(value: boolean) => row.toggleSelected(value)"
              />

              <slot
                v-else
                :name="`cell-${cell.column.id}`"
                :cell="cell"
                :row="row"
                :value="cell.getValue()"
              >
                <FlexRender :cell="cell" />
              </slot>
            </mt-table-cell>
          </mt-table-row>
        </template>
      </mt-table-body>
    </mt-table>

    <div v-if="pagination && totalRowCount > 0" class="mt-data-table-next__footer">
      <div class="mt-data-table-next__page-size">
        <mt-text as="span" size="xs" color="color-text-secondary-default" aria-hidden="true">
          {{ t("itemsPerPage") }}
        </mt-text>

        <mt-select
          class="mt-data-table-next__page-size-select"
          small
          hide-clearable-button
          :options="pageSizeOptions"
          :model-value="pagination.pageSize"
          :aria-label="t('itemsPerPage')"
          @update:model-value="onPageSizeChange"
        />
      </div>

      <mt-pagination
        :current-page="pagination.pageIndex + 1"
        :limit="pagination.pageSize"
        :total-items="totalRowCount"
        @change-current-page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData extends RowData">
/**
 * Experimental: the API of mt-data-table-next may still change in a future release.
 */

import { computed, useAttrs, type HTMLAttributes } from "vue";
import { useI18n } from "vue-i18n";
import {
  FlexRender,
  useTable,
  type Cell,
  type Column,
  type Header,
  type Row,
  type RowData,
  type Updater,
} from "@tanstack/vue-table";
import MtTable from "../mt-table/mt-table.vue";
import MtTableHeader from "../mt-table/mt-table-header.vue";
import MtTableBody from "../mt-table/mt-table-body.vue";
import MtTableRow from "../mt-table/mt-table-row.vue";
import MtTableHeaderCell from "../mt-table/mt-table-header-cell.vue";
import MtTableCell from "../mt-table/mt-table-cell.vue";
import MtCheckbox from "../mt-checkbox/mt-checkbox.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtSkeletonBar from "../mt-skeleton-bar/mt-skeleton-bar.vue";
import MtSelect from "../mt-select/mt-select.vue";
import MtText from "../mt-text/mt-text.vue";
import MtPagination from "../mt-pagination/mt-pagination.vue";
import {
  dataTableFeatures,
  type MtDataTableNextColumn,
  type MtDataTableNextFeatures,
  type MtDataTableNextPaginationState,
  type MtDataTableNextRowSelectionState,
  type MtDataTableNextSortingState,
} from "./_internal/mt-data-table-next-features";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /**
     * The rows of the table. Replace the array to update the table, changes inside it are not tracked.
     */
    data: TData[];
    /**
     * The columns of the table as TanStack Table column definitions, e.g. `{ accessorKey: "name", header: "Name" }`.
     * Set `meta.align` to align a column, `enableSorting: false` to keep it from being sorted.
     */
    columns: MtDataTableNextColumn<TData>[];
    /**
     * Replaces the rows with placeholders while data loads.
     */
    loading?: boolean;
    /**
     * The parent sorts and paginates the data, e.g. on the server, and the table renders `data` as given.
     * Use it with `v-model:sorting` and `v-model:pagination` to know what to load, and `row-count` for the total.
     */
    manual?: boolean;
    /**
     * The total number of rows on all pages when `manual` is set. Without `manual`, the table counts `data`.
     */
    rowCount?: number;
    /**
     * Returns the unique id of a row, used for keys and `v-model:row-selection`.
     * Defaults to the row's `id` property, and to its index for rows without one.
     */
    getRowId?: (row: TData, index: number) => string;
  }>(),
  {
    loading: false,
    manual: false,
    rowCount: undefined,
    getRowId: undefined,
  },
);

/**
 * The sorted column as `[{ id, desc }]`. Binding it makes the columns sortable.
 */
const sorting = defineModel<MtDataTableNextSortingState>("sorting");

/**
 * The current page as `{ pageIndex, pageSize }`, with `pageIndex` starting at 0. Binding it paginates the table.
 */
const pagination = defineModel<MtDataTableNextPaginationState>("pagination");

/**
 * The selected rows as `{ [rowId]: true }`. Binding it adds a checkbox column to select rows.
 */
const rowSelection = defineModel<MtDataTableNextRowSelectionState>("rowSelection");

defineSlots<{
  /**
   * Replaces the header content of the column with the given id, e.g. `#header-name`.
   */
  [key: `header-${string}`]: (props: {
    header: Header<MtDataTableNextFeatures, TData, unknown>;
    column: Column<MtDataTableNextFeatures, TData, unknown>;
  }) => unknown;
  /**
   * Replaces the cell content of the column with the given id, e.g. `#cell-name`.
   */
  [key: `cell-${string}`]: (props: {
    cell: Cell<MtDataTableNextFeatures, TData, unknown>;
    row: Row<MtDataTableNextFeatures, TData>;
    value: unknown;
  }) => unknown;
  /**
   * Replaces the "No results" text shown when there are no rows.
   */
  empty?: () => unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      noResults: "No results",
      selectRow: "Select row",
      selectAllRows: "Select all rows on this page",
      itemsPerPage: "Items per page",
    },
    de: {
      noResults: "Keine Ergebnisse",
      selectRow: "Zeile auswählen",
      selectAllRows: "Alle Zeilen auf dieser Seite auswählen",
      itemsPerPage: "Einträge pro Seite",
    },
  },
});

const SELECTION_COLUMN_ID = "mt-data-table-next-selection";
const PAGE_SIZES = [10, 25, 50, 100];

const attrs = useAttrs();

// `class` and `style` size and place the component, every other attribute
// (e.g. `aria-label`, `aria-labelledby`) belongs to the native table.
const rootAttrs = computed(
  () => ({ class: attrs.class, style: attrs.style }) as Pick<HTMLAttributes, "class" | "style">,
);

const tableAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")),
);

// A feature is on as soon as its model is bound
const isSortingEnabled = computed(() => sorting.value !== undefined);
const isPaginationEnabled = computed(() => pagination.value !== undefined);
const isSelectionEnabled = computed(() => rowSelection.value !== undefined);

const tableColumns = computed<MtDataTableNextColumn<TData>[]>(() =>
  isSelectionEnabled.value
    ? [{ id: SELECTION_COLUMN_ID, enableSorting: false }, ...props.columns]
    : props.columns,
);

function resolveUpdater<TValue>(updater: Updater<TValue>, previous: TValue): TValue {
  return typeof updater === "function"
    ? (updater as (previousValue: TValue) => TValue)(previous)
    : updater;
}

function resolveRowId(row: TData, index: number, parent?: Row<MtDataTableNextFeatures, TData>) {
  if (props.getRowId) {
    return props.getRowId(row, index);
  }

  const id = (row as { id?: unknown }).id;

  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return parent ? `${parent.id}.${index}` : String(index);
}

const table = useTable<MtDataTableNextFeatures, TData>({
  features: dataTableFeatures,
  data: computed(() => props.data),
  columns: tableColumns,
  state: computed(() => ({
    ...(sorting.value ? { sorting: sorting.value } : {}),
    ...(pagination.value ? { pagination: pagination.value } : {}),
    ...(rowSelection.value ? { rowSelection: rowSelection.value } : {}),
  })),
  getRowId: resolveRowId,
  enableSorting: isSortingEnabled,
  enableMultiSort: false,
  manualSorting: computed(() => props.manual || !isSortingEnabled.value),
  manualPagination: computed(() => props.manual || !isPaginationEnabled.value),
  // A getter, not a computed: the adapter falls back to the ref itself when a computed resolves to undefined
  get rowCount() {
    return props.manual ? props.rowCount : undefined;
  },
  enableRowSelection: isSelectionEnabled,
  onSortingChange: (updater) => {
    if (sorting.value) {
      sorting.value = resolveUpdater(updater, sorting.value);
    }
  },
  onPaginationChange: (updater) => {
    if (pagination.value) {
      pagination.value = resolveUpdater(updater, pagination.value);
    }
  },
  onRowSelectionChange: (updater) => {
    if (rowSelection.value) {
      rowSelection.value = resolveUpdater(updater, rowSelection.value);
    }
  },
});

const rows = computed(() => table.getRowModel().rows);
const leafColumns = computed(() => table.getAllLeafColumns());
const totalRowCount = computed(() => table.getRowCount());

const isAllPageRowsSelected = computed(() => table.getIsAllPageRowsSelected());
const isSomePageRowsSelected = computed(() => table.getIsSomePageRowsSelected());

// Keeps the table height while loading: as many placeholders as rows are shown, or a full page
const skeletonRowCount = computed(
  () => rows.value.length || (pagination.value ? pagination.value.pageSize : 5),
);

const pageSizeOptions = computed(() => {
  const sizes = new Set(PAGE_SIZES);

  if (pagination.value) {
    sizes.add(pagination.value.pageSize);
  }

  return [...sizes]
    .sort((a, b) => a - b)
    .map((size) => ({ id: size, label: String(size), value: size }));
});

function getAlign(column: Column<MtDataTableNextFeatures, TData, unknown>) {
  return column.columnDef.meta?.align ?? "start";
}

function getAriaSort(column: Column<MtDataTableNextFeatures, TData, unknown>) {
  const direction = column.getIsSorted();

  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";

  return undefined;
}

// Sorted columns show their direction, the others preview the direction of their first sort on hover
function getSortIconName(column: Column<MtDataTableNextFeatures, TData, unknown>) {
  const direction = column.getIsSorted() || column.getFirstSortDir();

  return direction === "asc" ? "regular-long-arrow-up" : "regular-long-arrow-down";
}

function onPageChange(page: number) {
  const lastPageIndex = Math.max(0, table.getPageCount() - 1);
  const pageIndex = Math.min(Math.max(0, page - 1), lastPageIndex);

  // mt-pagination also reports page 1 after the page size changed, which must not trigger another load
  if (pageIndex !== pagination.value?.pageIndex) {
    table.setPageIndex(pageIndex);
  }
}

function onPageSizeChange(pageSize: number | string) {
  table.setPagination({ pageIndex: 0, pageSize: Number(pageSize) });
}
</script>

<style scoped>
.mt-data-table-next {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Lets a height limit on the component scroll the rows below the sticky header, with the footer staying visible */
.mt-data-table-next__table {
  flex: 1 1 auto;
  min-height: 0;
}

/* Aligned to the top of the line, so the button does not make sortable header rows taller than plain ones */
.mt-data-table-next__sort-button {
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  gap: var(--scale-size-4);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-xs);
  background: none;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;

  &:hover {
    color: var(--color-text-primary-default);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: var(--scale-size-2);
  }
}

/* End-aligned columns keep their label flush with the numbers below, the icon moves to the start */
.mt-table-header-cell--align-end .mt-data-table-next__sort-button {
  flex-direction: row-reverse;
}

.mt-data-table-next__sort-icon {
  color: var(--color-icon-secondary-default);
  opacity: 0;
  transition: opacity 0.15s ease-out;
}

.mt-data-table-next__sort-button:hover .mt-data-table-next__sort-icon,
.mt-data-table-next__sort-button:focus-visible .mt-data-table-next__sort-icon {
  opacity: 1;
}

.mt-data-table-next__sort-icon--active {
  color: var(--color-icon-primary-default);
  opacity: 1;
}

/* Prefixed with the root class to win over the padding of the cell primitives */
.mt-data-table-next .mt-data-table-next__selection-cell {
  width: var(--scale-size-16);
  padding-inline-end: 0;

  /* Checkboxes keep a bottom margin for forms unless the `removeDefaultMargin` future flag is set */
  & :deep(.mt-field--checkbox) {
    margin-bottom: 0;
  }
}

/*
 * Rows span the whole table, so they take the subtle secondary background instead of the
 * interaction hover color that small items like menu entries use
 */
.mt-data-table-next__row--selectable:not(.mt-table-row--selected):hover {
  background-color: var(--color-background-secondary-default);
}

/*
 * Cells keep their content on one line, so rows stay one line high and scan as rows. A table wider
 * than its container scrolls horizontally instead of squeezing columns, which would still wrap
 * content such as a status dot and its label. The empty state spans all columns and wraps.
 */
.mt-data-table-next .mt-table-cell:not(.mt-data-table-next__empty) {
  white-space: nowrap;
}

.mt-data-table-next__table--has-rows :deep(.mt-table__table) {
  min-width: max-content;
}

.mt-data-table-next .mt-data-table-next__skeleton {
  height: var(--scale-size-12);
  margin-block: calc((var(--font-line-height-xs) - var(--scale-size-12)) / 2);
}

.mt-data-table-next .mt-data-table-next__empty {
  padding-block: var(--scale-size-32);
  color: var(--color-text-secondary-default);
}

.mt-data-table-next__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16) var(--scale-size-16) 0;
}

.mt-data-table-next__page-size {
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: var(--scale-size-8);
}

/* Fields keep a bottom margin for forms unless the `removeDefaultMargin` future flag is set */
.mt-data-table-next .mt-data-table-next__page-size-select {
  width: var(--scale-size-80);
  margin-bottom: 0;
}
</style>
