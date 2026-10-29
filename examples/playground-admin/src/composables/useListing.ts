import { computed, ref, shallowRef, watch } from "vue";
import type {
  Filter,
  MtDataTable,
} from "@shopware-ag/meteor-component-library";
import type { Criteria, Entities, EntityName } from "../../shared/types";
import { useRepository } from "./useRepository";

/** A column of `mt-data-table`. */
export type DataTableColumn = InstanceType<
  typeof MtDataTable
>["$props"]["columns"][number];

interface ListingOptions {
  sortBy: string;
  sortDirection?: "ASC" | "DESC";
  limit?: number;
  /** Filters the list always applies, on top of the ones the user picks. */
  filters?: () => Record<string, string[]>;
}

/**
 * The state of a list page, wired to the events of `mt-data-table`: search, sort, filters,
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

  const page = ref(1);
  const limit = ref(options.limit ?? 25);
  const term = ref("");
  const sortBy = ref(options.sortBy);
  const sortDirection = ref<"ASC" | "DESC">(options.sortDirection ?? "ASC");
  const appliedFilters = ref<Filter[]>([]);
  const selection = ref<string[]>([]);

  const criteria = computed<Criteria>(() => ({
    page: page.value,
    limit: limit.value,
    term: term.value,
    sortBy: sortBy.value,
    sortDirection: sortDirection.value,
    filters: {
      ...options.filters?.(),
      ...Object.fromEntries(
        appliedFilters.value.map((filter) => [
          filter.id,
          filter.type.options.map((option) => option.id),
        ]),
      ),
    },
  }));

  // A new search, filter or page size starts on the first page.
  watch(
    [term, appliedFilters, limit, () => JSON.stringify(options.filters?.())],
    () => {
      page.value = 1;
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

  function onSortChange(property: string, direction: "ASC" | "DESC") {
    sortBy.value = property;
    sortDirection.value = direction;
  }

  function onSelectionChange({ id, value }: { id: string; value: boolean }) {
    selection.value = value
      ? [...selection.value, id]
      : selection.value.filter((selected) => selected !== id);
  }

  function onMultipleSelectionChange({
    selections,
    value,
  }: {
    selections: string[];
    value: boolean;
  }) {
    selection.value = value
      ? [...new Set([...selection.value, ...selections])]
      : selection.value.filter((selected) => !selections.includes(selected));
  }

  return {
    items,
    total,
    isLoading,
    page,
    limit,
    term,
    sortBy,
    sortDirection,
    appliedFilters,
    selection,
    isFiltered: computed(
      () => term.value !== "" || appliedFilters.value.length > 0,
    ),
    load,
    onSortChange,
    onSelectionChange,
    onMultipleSelectionChange,
  };
}
