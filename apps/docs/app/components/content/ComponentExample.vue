<script setup lang="ts">
import { camelCase } from "scule";
import { useClipboard } from "@vueuse/core";
import { exampleKey } from "#shared/utils/exampleKey";
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";

// Opt the docs into the meteor component library's future behavior so examples
// reflect where the library is heading. "all" enables every current and future
// flag, so newly added flags show up here without touching this file.
// MtThemeProvider provides these flags to every descendant component via the
// library's own injection key.
const futureFlags = "all";

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
    /** Keep the code block's built-in copy button (hidden by default, since
     *  the toggle row already provides one). */
    inlineCopyButton?: boolean;
    /** Stretch the rendered example to fill the preview width. Off by default
     *  so intrinsic-width components (buttons, badges) stay left-aligned. */
    fullWidth?: boolean;
    /** Extra classes for the preview container. */
    class?: string;
  }>(),
  {
    preview: true,
    source: true,
    collapse: true,
    inlineCopyButton: false,
    fullWidth: false,
    class: undefined,
  },
);

const slots = defineSlots<{
  /** Manual code override; replaces the auto-generated source block. */
  code(props?: object): unknown;
}>();

const camelName = camelCase(props.name);
const pascalName = exampleKey(props.name);

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

const sourceText = computed(() => (example.value?.code ?? "").trim());

const code = computed(() => {
  if (!sourceText.value) return "";
  return `\`\`\`vue\n${sourceText.value}\n\`\`\``;
});

const { data: ast } = await useAsyncData(
  `component-example-ast-${camelName}`,
  () => cachedParseMarkdown(code.value),
  { watch: [code] },
);

const showCode = ref(!props.collapse);

const { copy, copied } = useClipboard();

// The rendered code block's only <button> is its built-in copy button; hide it
// unless explicitly opted back in, since the toggle row provides its own.
const codeWrapperClass = computed(() => [
  "[&_pre]:rounded-t-none! [&_pre]:border-t-0! [&_pre]:mt-0! [&_div.my-5]:my-0!",
  props.inlineCopyButton ? "" : "[&_button]:hidden!",
]);
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
        class="flex flex-wrap items-center justify-start gap-4 p-4"
        :class="[fullWidth ? '[&>*]:w-full' : '', props.class]"
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

    <div v-if="source" class="relative">
      <UCollapsible
        v-model:open="showCode"
        :unmount-on-hide="false"
        :ui="{
          content:
            'data-[state=open]:animate-[collapsible-down_200ms_var(--ease-out)] data-[state=closed]:animate-[collapsible-up_150ms_var(--ease-out)] motion-reduce:animate-none',
        }"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-1 rounded-t-none border border-muted py-3 px-3 text-sm text-[var(--color-text-primary-default)] transition-[background-color,border-radius] duration-100 ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--color-interaction-secondary-hover)]"
          :class="showCode ? 'rounded-b-none' : 'rounded-b-md delay-[0ms,150ms]'"
        >
          <UIcon
            name="i-lucide-chevron-right"
            class="size-3.5 transition-transform duration-150 ease-[var(--ease-out)] motion-reduce:transition-none"
            :class="showCode ? 'rotate-90' : ''"
          />
          <span>Code</span>
        </button>

        <template #content>
          <div v-if="!!slots.code" :class="codeWrapperClass">
            <slot name="code" />
          </div>
          <MDCRenderer
            v-else-if="ast"
            :body="(ast as any).body"
            :data="(ast as any).data"
            :class="codeWrapperClass"
          />
        </template>
      </UCollapsible>

      <!-- Copy button sits to the right of the toggle row. It is a sibling of
           the collapsible trigger (not nested in it) so clicking it neither
           toggles the code nor nests a button inside the trigger button. -->
      <UButton
        v-if="sourceText"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        color="neutral"
        variant="outline"
        size="sm"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        class="absolute right-2 top-2 z-10"
        @click="copy(sourceText)"
      />
    </div>
  </div>
</template>
