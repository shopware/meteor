import {
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from "@tanstack/vue-table";

export interface MtDataTableNextColumnMeta {
  /**
   * Horizontal alignment of the column's header and cells. Use `end` for numbers.
   */
  align?: "start" | "center" | "end";
}

/**
 * The TanStack Table features of the data table. Registering them once keeps every other
 * feature out of the bundle. The sort functions cover what `sortFn: "auto"` picks from.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<MtDataTableNextColumnMeta>(),
});

export type MtDataTableNextFeatures = typeof dataTableFeatures;

/**
 * A column of the data table: a TanStack Table column definition, e.g.
 * `{ accessorKey: "name", header: "Name" }`. Meteor options go in `meta`.
 */
export type MtDataTableNextColumn<TData extends RowData> = ColumnDef<
  MtDataTableNextFeatures,
  TData,
  any
>;

/*
 * The model types are declared here instead of re-exporting TanStack's, so the types consumers infer
 * from them don't point into `@tanstack/table-core`, which they don't depend on. They match
 * TanStack's state shapes.
 */

/** The sorted column. */
export interface MtDataTableNextColumnSort {
  /** The id of the column. */
  id: string;
  /** Whether it sorts descending. */
  desc: boolean;
}

/** The sorted columns, at most one. An empty list means unsorted. */
export type MtDataTableNextSortingState = MtDataTableNextColumnSort[];

/** The current page. */
export interface MtDataTableNextPaginationState {
  /** The index of the page, starting at 0. */
  pageIndex: number;
  /** The number of rows on a page. */
  pageSize: number;
}

/** The ids of the selected rows, each mapped to `true`. */
export type MtDataTableNextRowSelectionState = Record<string, true>;
