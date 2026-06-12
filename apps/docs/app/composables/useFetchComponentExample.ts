export interface ComponentExampleData {
  code: string;
  pascalName: string;
}

export function useFetchComponentExample(name: string) {
  if (import.meta.server) {
    const event = useRequestEvent();
    event?.node.res.setHeader(
      "x-nitro-prerender",
      [
        event?.node.res.getHeader("x-nitro-prerender"),
        `/api/component-example/${name}.json`,
      ]
        .filter(Boolean)
        .join(","),
    );
  }

  return useAsyncData<ComponentExampleData | null>(
    `component-example-${name}`,
    () =>
      $fetch<ComponentExampleData>(`/api/component-example/${name}.json`).catch(
        () => null,
      ),
    {
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
    },
  );
}
