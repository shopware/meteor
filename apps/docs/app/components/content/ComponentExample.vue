<script setup lang="ts">
import { camelCase, upperFirst } from "scule";

const props = withDefaults(
  defineProps<{
    /** Example component name, e.g. "button-variants-example". */
    name: string;
    /** Render the live preview window. */
    preview?: boolean;
    /** Render the source code below the preview. */
    source?: boolean;
    /** Hide the code behind a "show code" toggle. */
    collapse?: boolean;
    /** Extra classes for the preview container. */
    class?: string;
  }>(),
  {
    preview: true,
    source: true,
    collapse: true,
    class: undefined,
  },
);

const slots = defineSlots<{
  /** Manual code override; replaces the auto-generated source block. */
  code(props?: object): unknown;
}>();

const camelName = camelCase(props.name);
const pascalName = upperFirst(camelName);

const exampleModules = import.meta.glob(
  "~/components/content/examples/**/*.vue",
);
const exampleMatch = Object.entries(exampleModules).find(([path]) =>
  path.endsWith(`/${pascalName}.vue`),
);
const resolvedComponent = exampleMatch
  ? defineAsyncComponent(exampleMatch[1] as never)
  : undefined;

const { data: example } = await useFetchComponentExample(camelName);

const code = computed(() => {
  const source = example.value?.code?.trim() ?? "";
  if (!source) return "";

  const codeFence = `\`\`\`vue [${pascalName}.vue]\n${source}\n\`\`\``;
  if (props.collapse) {
    return `::code-collapse\n${codeFence}\n::`;
  }
  return codeFence;
});

const { data: ast } = await useAsyncData(
  `component-example-ast-${camelName}-${props.collapse}`,
  () => cachedParseMarkdown(code.value),
  { watch: [code] },
);
</script>

<template>
  <div class="my-5">
    <div
      v-if="preview"
      class="border border-muted relative"
      :class="source ? 'border-b-0 rounded-t-md' : 'rounded-md'"
    >
      <div
        v-if="resolvedComponent"
        class="flex flex-wrap items-center justify-center gap-4 p-4"
        :class="props.class"
      >
        <component :is="resolvedComponent" />
      </div>
      <div v-else class="p-4 text-sm text-muted">
        Example "{{ pascalName }}" not found.
      </div>
    </div>

    <template v-if="source">
      <div
        v-if="!!slots.code"
        class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!"
      >
        <slot name="code" />
      </div>
      <MDCRenderer
        v-else-if="ast"
        :body="(ast as any).body"
        :data="(ast as any).data"
        class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!"
      />
    </template>
  </div>
</template>
