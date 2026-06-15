export interface ComponentExampleData {
  code: string;
  pascalName: string;
}

export function useFetchComponentExample(name: string) {
  addPrerenderHint(`/api/component-example/${name}.json`);

  return useAsyncData<ComponentExampleData | null>(
    `component-example-${name}`,
    () =>
      $fetch<ComponentExampleData>(`/api/component-example/${name}.json`).catch(
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
