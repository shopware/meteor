<script setup lang="ts">
import { camelCase, upperFirst } from "scule";
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";
import { stripExampleCode } from "#shared/utils/stripExampleCode";

// Opt the docs into the meteor component library's future behavior so examples
// reflect where the library is heading. MtThemeProvider provides these flags to
// every descendant component via the library's own injection key.
const futureFlags = {
  removeCardWidth: true,
  removeDefaultMargin: true,
};

const props = withDefaults(
  defineProps<{
    /** Example component name, e.g. "button-variants-example". */
    name: string;
    /** Render the live preview window. */
    preview?: boolean;
    /** Render the source code below the preview. */
    source?: boolean;
    /** Hide the code behind a "Show code" toggle. */
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
  const source = stripExampleCode(example.value?.code ?? "");
  if (!source) return "";
  return `\`\`\`vue\n${source}\n\`\`\``;
});

const { data: ast } = await useAsyncData(
  `component-example-ast-${camelName}`,
  () => cachedParseMarkdown(code.value),
  { watch: [code] },
);

const showCode = ref(!props.collapse);
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
        <!-- Previews render client-only: example components may use browser
             APIs (ResizeObserver, document) that are unavailable during SSR. -->
        <ClientOnly>
          <MtThemeProvider :future="futureFlags">
            <component :is="resolvedComponent" />
          </MtThemeProvider>
        </ClientOnly>
      </div>
      <div v-else class="p-4 text-sm text-muted">
        Example "{{ pascalName }}" not found.
      </div>
    </div>

    <UCollapsible
      v-if="source"
      v-model:open="showCode"
      :unmount-on-hide="false"
    >
      <UButton
        block
        color="neutral"
        variant="soft"
        size="md"
        :label="showCode ? 'Hide code' : 'Show code'"
        trailing-icon="i-lucide-chevron-down"
        class="rounded-t-none border border-muted py-3 justify-center"
        :class="showCode ? 'rounded-b-none border-b-0' : 'rounded-b-md'"
        :ui="{
          trailingIcon: [
            'ms-0 transition-transform duration-200',
            showCode ? 'rotate-180' : '',
          ].join(' '),
        }"
      />

      <template #content>
        <div
          v-if="!!slots.code"
          class="[&_pre]:rounded-t-none! [&_pre]:mt-0! [&_div.my-5]:my-0!"
        >
          <slot name="code" />
        </div>
        <MDCRenderer
          v-else-if="ast"
          :body="(ast as any).body"
          :data="(ast as any).data"
          class="[&_pre]:rounded-t-none! [&_pre]:mt-0! [&_div.my-5]:my-0!"
        />
      </template>
    </UCollapsible>
  </div>
</template>
