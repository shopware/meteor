import { computed, ref, shallowRef, watch } from "vue";
import type {
  MtDataTableNextPaginationState,
  MtDataTableNextRowSelectionState,
  MtDataTableNextSortingState,
} from "@shopware-ag/meteor-component-library";
import type { Criteria, Entities, EntityName } from "../../shared/types";
import { useRepository } from "./useRepository";

interface ListingOptions {
  sortBy: string;
  sortDirection?: "ASC" | "DESC";
  limit?: number;
  /** Filters the list always applies, on top of the ones the user picks. */
  filters?: () => Record<string, string[]>;
}

/** How long the search waits for more typing before it loads. */
const SEARCH_DELAY = 300;

/**
 * Column ids come from their `accessorKey` with dots replaced by underscores, so `price_gross`
 * sorts by the property path `price.gross`.
 */
const toColumnId = (path: string) => path.replaceAll(".", "_");
const toPropertyPath = (columnId: string) => columnId.replaceAll("_", ".");

/**
 * The state of a list page, bound to the models of `mt-data-table-next`: search, sort, filters,
 * pagination and selection. Every change loads the matching page from the server.
 */
export function useListing<Name extends EntityName>(
  name: Name,
  options: ListingOptions,
) {
  const repository = useRepository(name);

  const items = shallowRef<Entities[Name][]>([]);
  const total = ref(0);
  const isLoading = ref(true);

  const term = ref("");
  const searchTerm = ref("");
  const sorting = ref<MtDataTableNextSortingState>([
    {
      id: toColumnId(options.sortBy),
      desc: options.sortDirection === "DESC",
    },
  ]);
  const pagination = ref<MtDataTableNextPaginationState>({
    pageIndex: 0,
    pageSize: options.limit ?? 25,
  });
  /** Filter id → accepted values. An empty list doesn't filter. */
  const filterValues = ref<Record<string, string[]>>({});
  const rowSelection = ref<MtDataTableNextRowSelectionState>({});

  let searchTimeout: ReturnType<typeof setTimeout> | undefined;

  watch(term, (value) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => (searchTerm.value = value), SEARCH_DELAY);
  });

  const criteria = computed<Criteria>(() => {
    // Without a sorted column, the list keeps its default order.
    const [order] = sorting.value;

    return {
      page: pagination.value.pageIndex + 1,
      limit: pagination.value.pageSize,
      term: searchTerm.value,
      sortBy: order ? toPropertyPath(order.id) : options.sortBy,
      sortDirection: order
        ? order.desc
          ? "DESC"
          : "ASC"
        : options.sortDirection,
      filters: { ...options.filters?.(), ...filterValues.value },
    };
  });

  // A new search or filter starts on the first page.
  watch(
    [
      searchTerm,
      () => JSON.stringify(filterValues.value),
      () => JSON.stringify(options.filters?.()),
    ],
    () => {
      pagination.value = { ...pagination.value, pageIndex: 0 };
    },
  );

  let latestRequest = 0;

  async function load() {
    const request = ++latestRequest;
    isLoading.value = true;

    const result = await repository.search(criteria.value);

    // A newer request replaced this one while it was pending.
    if (request !== latestRequest) return;

    items.value = result.data;
    total.value = result.total;
    isLoading.value = false;
  }

  watch(criteria, load, { immediate: true });

  const selectedIds = computed(() => Object.keys(rowSelection.value));

  function deselect(ids: string[]) {
    rowSelection.value = Object.fromEntries(
      Object.entries(rowSelection.value).filter(([id]) => !ids.includes(id)),
    ) as MtDataTableNextRowSelectionState;
  }

  return {
    items,
    total,
    isLoading,
    term,
    sorting,
    pagination,
    filterValues,
    rowSelection,
    selectedIds,
    isFiltered: computed(
      () =>
        searchTerm.value !== "" ||
        Object.values(filterValues.value).some((values) => values.length > 0),
    ),
    load,
    deselect,
  };
}
