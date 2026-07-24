/**
 * Fetches a build-time JSON endpoint and bakes it into the prerendered payload.
 * Shared by the component-example and component-meta fetchers: both register a
 * prerender hint and read the result back from the static payload on the
 * client, so the only thing that varies is the cache key, URL, and payload type.
 */
export function useFetchDocsJson<T>(key: string, path: string) {
  addPrerenderHint(path);

  return useAsyncData<T | null>(key, () => $fetch<T>(path).catch(() => null), {
    lazy: import.meta.client,
    dedupe: "defer",
    getCachedData: (cacheKey, nuxtApp) =>
      nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey],
  });
}
