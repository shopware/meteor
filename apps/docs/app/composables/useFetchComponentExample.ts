export interface ComponentExampleData {
  code: string;
  pascalName: string;
}

export function useFetchComponentExample(name: string) {
  return useFetchDocsJson<ComponentExampleData>(
    `component-example-${name}`,
    `/api/component-example/${name}.json`,
  );
}
