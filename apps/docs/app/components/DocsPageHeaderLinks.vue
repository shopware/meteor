<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";
import { computed } from "vue";
import { joinURL, withTrailingSlash } from "ufo";
import { useRuntimeConfig } from "#imports";

interface MeteorPageMeta {
  tagName?: string;
  packageImports?: string | string[];
  packageName?: string;
  sourcePath?: string;
  sourceUrl?: string;
  npmPackage?: string;
}

const GITHUB_TREE_URL = "https://github.com/shopware/meteor/tree/main";
const DEFAULT_COMPONENT_PACKAGE = "@shopware-ag/meteor-component-library";

const route = useRoute();
const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const requestUrl = useRequestURL();
const appBaseURL = runtimeConfig.app?.baseURL || "/";
const mcpRoute =
  (runtimeConfig.public.mcp as { route?: string } | undefined)?.route || "/mcp";

const { copy, copied } = useClipboard();
const { locale, isEnabled, t } = useDocusI18n();
const collectionName = computed(() =>
  isEnabled.value ? `docs_${locale.value}` : "docs",
);

const { data: page } = await useAsyncData(
  `meteor-page-header-${route.path}`,
  () =>
    queryCollection(collectionName.value as keyof Collections)
      .path(route.path)
      .first() as Promise<{ meteor?: MeteorPageMeta } | null>,
);

const meta = computed(() => page.value?.meteor);

const sourceUrl = computed(() => {
  if (meta.value?.sourceUrl) return meta.value.sourceUrl;
  if (meta.value?.sourcePath) {
    return `${GITHUB_TREE_URL}/${meta.value.sourcePath}`;
  }
  return null;
});

const importCode = computed(() => {
  if (!meta.value?.packageImports) return null;
  const imports = Array.isArray(meta.value.packageImports)
    ? meta.value.packageImports
    : meta.value.packageImports.split(",").map((item) => item.trim());
  const normalizedImports = imports.filter(Boolean);
  const packageName = meta.value.packageName || DEFAULT_COMPONENT_PACKAGE;

  if (normalizedImports.length === 0) return null;
  if (normalizedImports.length === 1) {
    return `import { ${normalizedImports[0]} } from "${packageName}";`;
  }
  return `import {\n  ${normalizedImports.join(",\n  ")},\n} from "${packageName}";`;
});

const markdownLink = computed(() =>
  absoluteAppUrl(joinURL("raw", `${route.path}.md`)),
);
const mcpServerUrl = computed(() => absoluteAppUrl(mcpRoute));
const mcpDeeplink = computed(() =>
  absoluteAppUrl(joinURL(mcpRoute, "deeplink")),
);

function absoluteAppUrl(path: string) {
  return new URL(
    joinURL(withTrailingSlash(appBaseURL), path),
    requestUrl.origin,
  ).href;
}

const items = computed<DropdownMenuItem[][]>(() => {
  const metadataItems: DropdownMenuItem[] = [];

  if (importCode.value) {
    metadataItems.push({
      label: "Copy import",
      icon: "i-lucide-copy",
      onSelect() {
        copy(importCode.value || "");
        toast.add({
          title: "Copied to clipboard",
          icon: "i-lucide-check-circle",
        });
      },
    });
  }

  if (sourceUrl.value) {
    metadataItems.push({
      label: "View source",
      icon: "i-simple-icons:github",
      target: "_blank",
      to: sourceUrl.value,
    });
  }

  const pageItems: DropdownMenuItem[] = [
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
      to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(
        `Read ${markdownLink.value} so I can ask questions about it.`,
      )}`,
    },
    {
      label: t("docs.copy.claude"),
      icon: "i-simple-icons:anthropic",
      target: "_blank",
      to: `https://claude.ai/new?q=${encodeURIComponent(
        `Read ${markdownLink.value} so I can ask questions about it.`,
      )}`,
    },
  ];

  const mcpItems: DropdownMenuItem[] = [
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
  ];

  return [
    ...(metadataItems.length > 0 ? [metadataItems] : []),
    pageItems,
    mcpItems,
  ];
});

async function copyPage() {
  const page = await $fetch<string>(`/raw${route.path}.md`);
  copy(page);
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-end gap-2">
    <UButton
      v-if="sourceUrl"
      label="GitHub"
      icon="i-simple-icons:github"
      color="neutral"
      variant="soft"
      size="sm"
      :to="sourceUrl"
      target="_blank"
    />

    <UFieldGroup size="sm">
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
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="soft"
          class="border-l border-muted"
        />
      </UDropdownMenu>
    </UFieldGroup>
  </div>
</template>
