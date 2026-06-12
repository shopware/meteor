import type { FetchedComponentMeta } from "~/types/component-meta";

export function useFetchComponentMeta(name: string) {
  if (import.meta.server) {
    const event = useRequestEvent();
    event?.node.res.setHeader(
      "x-nitro-prerender",
      [
        event?.node.res.getHeader("x-nitro-prerender"),
        `/api/component-meta/${name}.json`,
      ]
        .filter(Boolean)
        .join(","),
    );
  }

  return useAsyncData<FetchedComponentMeta | null>(
    `component-meta-${name}`,
    () =>
      $fetch<FetchedComponentMeta>(`/api/component-meta/${name}.json`).catch(
        () => null,
      ),
    {
      lazy: import.meta.client,
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
    },
  );
}
