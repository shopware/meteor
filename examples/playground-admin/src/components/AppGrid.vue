<script setup lang="ts" generic="Row extends { id: string }">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtButton,
  MtCheckbox,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtSkeletonBar,
} from "@shopware-ag/meteor-component-library";

export interface GridColumn {
  /** The property of the row the column shows, and the name of its `cell-<key>` slot. */
  key: string;
  label: string;
  align?: "start" | "end" | "center";
  /** A CSS width, such as "12rem". Columns without one share the remaining space. */
  width?: string;
  sortable?: boolean;
}

/**
 * A light table in the look of the Administration's data grid: lines between the columns, a menu
 * on each column header, zebra rows, an optional selection column and a row menu at the end. It
 * renders only what it is given: the page loads, sorts and pages the rows.
 */
const props = withDefaults(
  defineProps<{
    columns: GridColumn[];
    rows: Row[];
    caption: string;
    isLoading?: boolean;
    /** Shows a checkbox in front of each row. */
    selectable?: boolean;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
    /** The number of placeholder rows while loading. */
    skeletonRows?: number;
    /** Opens a row when it is clicked. */
    clickable?: boolean;
    /** Leaves out the column menus and the settings button, for small grids inside cards. */
    plain?: boolean;
  }>(),
  {
    isLoading: false,
    selectable: false,
    sortBy: undefined,
    sortDirection: "ASC",
    skeletonRows: 8,
    clickable: false,
    plain: false,
  },
);

const selection = defineModel<string[]>("selection", { default: () => [] });

const emit = defineEmits<{
  sort: [key: string, direction: "ASC" | "DESC"];
  open: [row: Row];
}>();

const slots = defineSlots<{
  [key: `cell-${string}`]: (props: { row: Row }) => unknown;
  actions?: (props: { row: Row }) => unknown;
  bulk?: (props: { count: number }) => unknown;
  empty?: () => unknown;
}>();

const { t } = useI18n();

const hasActions = computed(() => !!slots.actions);

/** The columns the user hid with the column menu. */
const hiddenColumns = ref<string[]>([]);

const visibleColumns = computed(() =>
  props.columns.filter((column) => !hiddenColumns.value.includes(column.key)),
);

const allSelected = computed(
  () =>
    props.rows.length > 0 &&
    props.rows.every((row) => selection.value.includes(row.id)),
);

const someSelected = computed(
  () =>
    !allSelected.value &&
    props.rows.some((row) => selection.value.includes(row.id)),
);

function toggleAll(value: boolean) {
  const ids = props.rows.map((row) => row.id);

  selection.value = value
    ? [...new Set([...selection.value, ...ids])]
    : selection.value.filter((id) => !ids.includes(id));
}

function toggleRow(id: string, value: boolean) {
  selection.value = value
    ? [...selection.value, id]
    : selection.value.filter((selected) => selected !== id);
}

function sort(column: GridColumn, direction?: "ASC" | "DESC") {
  if (!column.sortable) return;

  emit(
    "sort",
    column.key,
    direction ??
      (props.sortBy === column.key && props.sortDirection === "ASC"
        ? "DESC"
        : "ASC"),
  );
}

function ariaSort(column: GridColumn) {
  if (!column.sortable || props.sortBy !== column.key) return undefined;

  return props.sortDirection === "ASC" ? "ascending" : "descending";
}

/** Reads a dotted path such as "price.gross". */
function value(row: Row, key: string) {
  return key
    .split(".")
    .reduce<unknown>(
      (object, part) => (object as Record<string, unknown> | null)?.[part],
      row,
    );
}

function onRowClick(row: Row, event: MouseEvent) {
  if (!props.clickable) return;
  // Clicks on the checkbox, links and the row menu keep their own behavior.
  if ((event.target as HTMLElement).closest("a, button, input, label")) return;

  emit("open", row);
}
</script>

<template>
  <div class="app-grid" :class="{ 'app-grid--plain': plain }">
    <div
      v-if="selectable && selection.length > 0 && slots.bulk"
      class="app-grid__bulk"
    >
      <span>{{ t("grid.selected", { n: selection.length }) }}</span>
      <slot name="bulk" :count="selection.length" />
    </div>

    <table class="app-grid__table">
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
        <col v-if="hasActions" class="app-grid__col-fixed" />
      </colgroup>

      <thead>
        <tr>
          <th v-if="selectable" class="app-grid__selection" scope="col">
            <mt-checkbox
              :model-value="allSelected"
              :partial="someSelected"
              :disabled="isLoading || rows.length === 0"
              @update:model-value="toggleAll"
            />
          </th>

          <th
            v-for="(column, index) in visibleColumns"
            :key="column.key"
            scope="col"
            :class="[
              `app-grid__cell--${column.align ?? 'start'}`,
              { 'app-grid__cell--sorted': sortBy === column.key },
            ]"
            :aria-sort="ariaSort(column)"
          >
            <div class="app-grid__header">
              <button
                v-if="column.sortable"
                type="button"
                class="app-grid__sort"
                @click="sort(column)"
              >
                {{ column.label }}
                <mt-icon
                  v-if="sortBy === column.key"
                  :name="
                    sortDirection === 'ASC'
                      ? 'regular-long-arrow-up'
                      : 'regular-long-arrow-down'
                  "
                  size="var(--scale-size-12)"
                  decorative
                />
              </button>
              <span v-else>{{ column.label }}</span>

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
                    <mt-action-menu-group v-if="column.sortable">
                      <mt-action-menu-item
                        icon="regular-long-arrow-up"
                        @select="sort(column, 'ASC')"
                      >
                        {{ t("grid.sortAscending") }}
                      </mt-action-menu-item>
                      <mt-action-menu-item
                        icon="regular-long-arrow-down"
                        @select="sort(column, 'DESC')"
                      >
                        {{ t("grid.sortDescending") }}
                      </mt-action-menu-item>
                    </mt-action-menu-group>
                    <mt-action-menu-group>
                      <mt-action-menu-item
                        icon="regular-eye-slash"
                        :disabled="index === 0"
                        @select="hiddenColumns = [...hiddenColumns, column.key]"
                      >
                        {{ t("grid.hideColumn") }}
                      </mt-action-menu-item>
                    </mt-action-menu-group>
                  </mt-action-menu>
                </mt-dropdown-menu-portal>
              </mt-dropdown-menu-root>
            </div>
          </th>

          <th v-if="hasActions" class="app-grid__actions" scope="col">
            <mt-dropdown-menu-root v-if="!plain">
              <mt-dropdown-menu-trigger as-child>
                <mt-button
                  class="app-grid__settings"
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

      <tbody v-if="isLoading">
        <tr v-for="row in skeletonRows" :key="row">
          <td v-if="selectable" class="app-grid__selection" />
          <td v-for="column in visibleColumns" :key="column.key">
            <mt-skeleton-bar class="app-grid__skeleton" />
          </td>
          <td v-if="hasActions" class="app-grid__actions" />
        </tr>
      </tbody>

      <tbody v-else-if="rows.length > 0">
        <tr
          v-for="row in rows"
          :key="row.id"
          :class="{
            'is--selected': selection.includes(row.id),
            'is--clickable': clickable,
          }"
          @click="onRowClick(row, $event)"
        >
          <td v-if="selectable" class="app-grid__selection">
            <mt-checkbox
              :model-value="selection.includes(row.id)"
              @update:model-value="toggleRow(row.id, $event)"
            />
          </td>

          <td
            v-for="column in visibleColumns"
            :key="column.key"
            :class="`app-grid__cell--${column.align ?? 'start'}`"
          >
            <slot :name="`cell-${column.key}`" :row="row">
              {{ value(row, column.key) ?? "" }}
            </slot>
          </td>

          <td v-if="hasActions" class="app-grid__actions">
            <mt-dropdown-menu-root>
              <mt-dropdown-menu-trigger as-child>
                <button
                  type="button"
                  class="app-grid__row-menu"
                  :aria-label="t('grid.rowActions')"
                >
                  <mt-icon
                    name="solid-ellipsis-h-s"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </button>
              </mt-dropdown-menu-trigger>

              <mt-dropdown-menu-portal>
                <mt-action-menu>
                  <slot name="actions" :row="row" />
                </mt-action-menu>
              </mt-dropdown-menu-portal>
            </mt-dropdown-menu-root>
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
  font-variant-numeric: tabular-nums;
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
  color: var(--color-text-primary-default);
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

.app-grid__cell--end {
  text-align: end;
}

.app-grid__cell--center {
  text-align: center;
}

.app-grid__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-6);
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

th.app-grid__cell--sorted .app-grid__sort {
  color: var(--color-text-brand-default);
}

.app-grid__column-menu,
.app-grid__row-menu {
  display: inline-grid;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  padding: 0;
  color: var(--color-icon-primary-default);
  background: none;
  border: 0;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.app-grid__column-menu {
  color: var(--color-icon-secondary-default);
}

.app-grid__column-menu:hover,
.app-grid__row-menu:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.app-grid__sort:focus-visible,
.app-grid__column-menu:focus-visible,
.app-grid__row-menu:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.app-grid__selection,
.app-grid__actions {
  width: 5.5rem;
  min-width: 5.5rem;
  padding: 0;
  text-align: center;
}

.app-grid__selection :deep(.mt-field--checkbox__container) {
  display: flex;
  justify-content: center;
  margin: 0;
}

.app-grid__selection :deep(.mt-field--checkbox) {
  margin: 0;
}

tbody tr:nth-child(even) td {
  background-color: var(--color-elevation-surface-sunken);
}

tbody tr:hover td,
tbody tr.is--selected td {
  background-color: var(--color-background-brand-default);
}

tbody tr.is--clickable {
  cursor: pointer;
}

/* Links in the grid read as text, as in the Administration, and turn blue on the row's hover. */
td :deep(.mt-link) {
  color: var(--color-text-primary-default);
  text-decoration: none;
}

tr:hover td :deep(.mt-link) {
  color: var(--color-text-brand-default);
}

.app-grid__skeleton {
  width: 70%;
  height: var(--scale-size-16);
  margin: 0;
}

.app-grid__bulk {
  display: flex;
  align-items: center;
  gap: var(--scale-size-16);
  min-height: var(--scale-size-48);
  padding: var(--scale-size-8) var(--scale-size-20) var(--scale-size-8) 5.5rem;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-background-brand-default);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.app-grid__empty {
  padding: var(--scale-size-48) var(--scale-size-16);
}
</style>
