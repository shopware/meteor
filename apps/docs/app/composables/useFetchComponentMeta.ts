import type { FetchedComponentMeta } from "~/types/component-meta";

export function useFetchComponentMeta(name: string) {
  addPrerenderHint(`/api/component-meta/${name}.json`);

  return useAsyncData<FetchedComponentMeta | null>(
    `component-meta-${name}`,
    () =>
      $fetch<FetchedComponentMeta>(`/api/component-meta/${name}.json`).catch(
        () => null,
      ),
    {
      lazy: import.meta.client,
      dedupe: "defer",
      getCachedData: (key, nuxtApp) =>
        nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
    },
  );
}
