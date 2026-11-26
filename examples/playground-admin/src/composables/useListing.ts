import { computed, ref, shallowRef, watch, type Ref } from "vue";
import type { Criteria, Entities, EntityName } from "../../shared/types";
import { useRepository } from "./useRepository";

interface ListingOptions {
  sortBy: string;
  sortDirection?: "ASC" | "DESC";
  limit?: number;
  /** Filters the list always applies, on top of the ones the user picks. */
  filters?: () => Record<string, string[]>;
  /** The search term, such as the one of the top bar. Defaults to a term of the list's own. */
  term?: Ref<string>;
}

/**
 * The state of a list page: search, sort, filters and pagination. Every change loads the matching
 * page from the server.
 */
export function useListing<Name extends EntityName>(
  name: Name,
  options: ListingOptions,
) {
  const repository = useRepository(name);

  const items = shallowRef<Entities[Name][]>([]);
  const total = ref(0);
  const isLoading = ref(true);
  /** Whether the first page arrived, after which the title shows the number of results. */
  const hasLoaded = ref(false);

  const page = ref(1);
  const limit = ref(options.limit ?? 25);
  const term = options.term ?? ref("");
  const sortBy = ref(options.sortBy);
  const sortDirection = ref<"ASC" | "DESC">(options.sortDirection ?? "ASC");

  const criteria = computed<Criteria>(() => ({
    page: page.value,
    limit: limit.value,
    term: term.value,
    sortBy: sortBy.value,
    sortDirection: sortDirection.value,
    filters: options.filters?.(),
  }));

  // A new search, filter or page size starts on the first page.
  watch(
    [term, limit, () => JSON.stringify(options.filters?.())],
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
    hasLoaded.value = true;
  }

  watch(criteria, load, { immediate: true });

  function onSortChange(property: string, direction: "ASC" | "DESC") {
    sortBy.value = property;
    sortDirection.value = direction;
  }

  return {
    items,
    total,
    isLoading,
    hasLoaded,
    page,
    limit,
    term,
    sortBy,
    sortDirection,
    isFiltered: computed(() => term.value !== ""),
    load,
    onSortChange,
  };
}
