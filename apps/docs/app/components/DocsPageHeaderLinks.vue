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
const mcpDeeplink = computed(
  () =>
    `${window?.location?.origin}${joinURL(appBaseURL, mcpRoute, "deeplink")}`,
);

// Link a component page to its source folder on GitHub. The slug -> folder map
// is provided at build time by modules/meteor-components.ts.
const componentSourceUrl = computed(() => {
  if (!route.path.startsWith("/components/")) return undefined;
  const slug = route.path.split("/").filter(Boolean).pop() ?? "";
  const sources = (runtimeConfig.public.componentSourcePaths ?? {}) as Record<
    string,
    string
  >;
  const path = sources[slug];
  const github = appConfig.github as
    | { url?: string; branch?: string }
    | undefined;
  if (!path || !github?.url) return undefined;
  return `${github.url}/tree/${github.branch || "main"}/${path}`;
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
    {
      label: t("docs.copy.gpt"),
      icon: "i-simple-icons:openai",
      target: "_blank",
      to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
    },
    {
      label: t("docs.copy.claude"),
      icon: "i-simple-icons:anthropic",
      target: "_blank",
      to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
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
    {
      label: "Add MCP Server",
      icon: "i-simple-icons:cursor",
      target: "_blank",
      to: mcpDeeplink.value,
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
      v-if="componentSourceUrl"
      :to="componentSourceUrl"
      target="_blank"
      icon="i-simple-icons:github"
      label="Source"
      color="neutral"
      variant="soft"
      size="md"
      :ui="{ leadingIcon: 'text-neutral size-3.5' }"
    />

    <UFieldGroup size="md">
      <UButton
        :label="t('docs.copy.page')"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        color="neutral"
        variant="soft"
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
        <UButton icon="i-lucide-chevron-down" color="neutral" variant="soft" />
      </UDropdownMenu>
    </UFieldGroup>
  </div>
</template>
