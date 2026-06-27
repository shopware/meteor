import type { FetchedComponentMeta } from "~/types/component-meta";

export function useFetchComponentMeta(name: string) {
  return useFetchDocsJson<FetchedComponentMeta>(
    `component-meta-${name}`,
    `/api/component-meta/${name}.json`,
  );
}
