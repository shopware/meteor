export function useComponentExampleSource(name: string) {
  if (import.meta.server) {
    addPrerenderPath(`/api/component-example/${name}.json`);
  }

  return useAsyncData(
    `component-example-source-${name}`,
    () => $fetch<{ code: string }>(`/api/component-example/${name}.json`),
    {
      lazy: import.meta.client,
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
    },
  );
}
