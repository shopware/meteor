import { camelCase } from "scule";

/**
 * The source of an example or block SFC: as plain text to copy, and parsed as
 * a `vue` code block for MDCRenderer. Await `ready` to have both during SSR.
 */
export function useExampleSource(name: string) {
  const camelName = camelCase(name);
  const example = useFetchComponentExample(camelName);

  const sourceText = computed(() => (example.data.value?.code ?? "").trim());

  const code = computed(() => {
    if (!sourceText.value) return "";
    return `\`\`\`vue\n${sourceText.value}\n\`\`\``;
  });

  const ast = useAsyncData(
    `component-example-ast-${camelName}`,
    async () => {
      await example;
      return cachedParseMarkdown(code.value);
    },
    { watch: [code] },
  );

  return {
    sourceText,
    ast: ast.data,
    ready: Promise.all([example, ast]),
  };
}
