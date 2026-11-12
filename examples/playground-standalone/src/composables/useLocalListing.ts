import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import type {
  Filter,
  MtDataTable,
} from "@shopware-ag/meteor-component-library";

/** A column of `mt-data-table`. */
export type DataTableColumn = InstanceType<
  typeof MtDataTable
>["$props"]["columns"][number];

interface LocalListingOptions<Item> {
  /** The texts of an item the search looks through. */
  searchText: (item: Item) => string[];
  /** The values of an item a filter with the given id matches against. */
  filterValues?: (item: Item, filterId: string) => string[];
  /** The value an item sorts by for the given property. */
  sortValue?: (item: Item, property: string) => string | number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  limit?: number;
}

/**
 * The state of a list page over items in memory, wired to the events of `mt-data-table`: search,
 * filters, sort and pagination. It follows `useListing` of the admin playground, without a server.
 */
export function useLocalListing<Item>(
  source: MaybeRefOrGetter<Item[]>,
  options: LocalListingOptions<Item>,
) {
  const page = ref(1);
  const limit = ref(options.limit ?? 25);
  const term = ref("");
  const sortBy = ref(options.sortBy ?? "");
  const sortDirection = ref<"ASC" | "DESC">(options.sortDirection ?? "ASC");
  const appliedFilters = ref<Filter[]>([]);

  const matching = computed(() => {
    const query = term.value.trim().toLowerCase();

    return toValue(source).filter((item) => {
      const matchesTerm =
        !query ||
        options
          .searchText(item)
          .some((text) => text.toLowerCase().includes(query));

      // Options of one filter widen the result, separate filters narrow it.
      const matchesFilters = appliedFilters.value.every((filter) => {
        const values = options.filterValues?.(item, filter.id) ?? [];
        return filter.type.options.some((option) => values.includes(option.id));
      });

      return matchesTerm && matchesFilters;
    });
  });

  const sorted = computed(() => {
    const { sortValue } = options;
    if (!sortBy.value || !sortValue) return matching.value;

    const direction = sortDirection.value === "ASC" ? 1 : -1;
    return [...matching.value].sort((a, b) => {
      const left = sortValue(a, sortBy.value);
      const right = sortValue(b, sortBy.value);
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * direction;
      }
      return String(left).localeCompare(String(right)) * direction;
    });
  });

  const items = computed(() =>
    sorted.value.slice(
      (page.value - 1) * limit.value,
      page.value * limit.value,
    ),
  );

  // A new search, filter or page size starts on the first page.
  watch([term, appliedFilters, limit], () => {
    page.value = 1;
  });

  function onSortChange(property: string, direction: "ASC" | "DESC") {
    sortBy.value = property;
    sortDirection.value = direction;
  }

  function clear() {
    term.value = "";
    appliedFilters.value = [];
  }

  return {
    items,
    total: computed(() => matching.value.length),
    page,
    limit,
    term,
    sortBy,
    sortDirection,
    appliedFilters,
    isFiltered: computed(
      () => term.value !== "" || appliedFilters.value.length > 0,
    ),
    onSortChange,
    clear,
  };
}
