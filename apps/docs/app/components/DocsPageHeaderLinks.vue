<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { joinURL, withTrailingSlash } from "ufo";
import { useRuntimeConfig } from "#imports";

const route = useRoute();
const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const appBaseURL = runtimeConfig.app?.baseURL || "/";
const mcpRoute =
  (runtimeConfig.public.mcp as { route?: string } | undefined)?.route || "/mcp";

const { copy, copied } = useClipboard();
const { t } = useDocusI18n();

const markdownLink = computed(
  () =>
    `${window?.location?.origin}${withTrailingSlash(appBaseURL)}raw${route.path}.md`,
);
const mcpServerUrl = computed(
  () => `${window?.location?.origin}${joinURL(appBaseURL, mcpRoute)}`,
);

// The slug -> repo-relative source folder map, provided at build time by
// modules/meteor-components.ts. Its keys double as the set of known components.
const componentSourcePaths = computed(
  () =>
    (runtimeConfig.public.componentSourcePaths ?? {}) as Record<string, string>,
);

// The current component slug, or undefined outside a component page. Both the
// GitHub and Storybook links are gated on this so they only show for real
// components and always appear together.
const componentSlug = computed(() => {
  if (!route.path.startsWith("/components/")) return undefined;
  const slug = route.path.split("/").filter(Boolean).pop();
  return slug && componentSourcePaths.value[slug] ? slug : undefined;
});

// Link a component page to its source folder on GitHub.
const componentSourceUrl = computed(() => {
  if (!componentSlug.value) return undefined;
  const path = componentSourcePaths.value[componentSlug.value];
  const github = appConfig.github as
    | { url?: string; branch?: string }
    | undefined;
  if (!path || !github?.url) return undefined;
  return `${github.url}/tree/${github.branch || "main"}/${path}`;
});

// Link a component page to its Storybook entry. The docs slug matches the
// Storybook id prefix (e.g. "data-table" -> components-data-table); Storybook
// resolves that to the component's autodocs (or first story) automatically.
const componentStorybookUrl = computed(() => {
  if (!componentSlug.value) return undefined;
  const storybook = appConfig.storybook as { url?: string } | undefined;
  if (!storybook?.url) return undefined;
  return `${storybook.url}/?path=/docs/components-${componentSlug.value}`;
});

const items = computed(() => [
  [
    {
      label: t("docs.copy.link"),
      icon: "i-lucide-link",
      onSelect() {
        copy(markdownLink.value);
      },
    },
    {
      label: t("docs.copy.view"),
      icon: "i-simple-icons:markdown",
      target: "_blank",
      to: markdownLink.value,
    },
  ],
  [
    {
      label: "Copy MCP Server URL",
      icon: "i-lucide-link",
      onSelect() {
        copy(mcpServerUrl.value);
        toast.add({
          title: "Copied to clipboard",
          icon: "i-lucide-check-circle",
        });
      },
    },
  ],
]);

async function copyPage() {
  const page = await $fetch<string>(`/raw${route.path}.md`);
  copy(page);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      v-if="componentStorybookUrl"
      :to="componentStorybookUrl"
      target="_blank"
      icon="i-custom:storybook"
      label="Storybook"
      color="neutral"
      variant="outline"
      size="md"
      :ui="{ leadingIcon: 'text-neutral size-3.5' }"
    />

    <UButton
      v-if="componentSourceUrl"
      :to="componentSourceUrl"
      target="_blank"
      icon="i-simple-icons:github"
      label="GitHub"
      color="neutral"
      variant="outline"
      size="md"
      :ui="{ leadingIcon: 'text-neutral size-3.5' }"
    />

    <UFieldGroup size="md">
      <UButton
        :label="t('docs.copy.page')"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        color="neutral"
        variant="outline"
        :ui="{
          leadingIcon: 'text-neutral size-3.5',
        }"
        @click="copyPage"
      />

      <UDropdownMenu
        size="sm"
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
      >
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="outline"
        />
      </UDropdownMenu>
    </UFieldGroup>
  </div>
</template>
