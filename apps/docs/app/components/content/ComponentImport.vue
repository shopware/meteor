<template>
  <div v-if="codeFence" class="not-prose my-6 [&_.my-5]:!my-0">
    <MDC :value="codeFence" />
  </div>
</template>

<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import { computed } from "vue";

interface MeteorPageMeta {
  packageImports?: string | string[];
  packageName?: string;
}

const DEFAULT_COMPONENT_PACKAGE = "@shopware-ag/meteor-component-library";

const route = useRoute();
const { locale, isEnabled } = useDocusI18n();
const collectionName = computed(() =>
  isEnabled.value ? `docs_${locale.value}` : "docs",
);

const { data: page } = await useAsyncData(
  `meteor-component-import-${route.path}`,
  () =>
    queryCollection(collectionName.value as keyof Collections)
      .path(route.path)
      .first() as Promise<{ meteor?: MeteorPageMeta } | null>,
);

const importCode = computed(() => {
  const imports = page.value?.meteor?.packageImports;
  if (!imports) return "";

  const normalizedImports = (
    Array.isArray(imports) ? imports : imports.split(",")
  )
    .map((item) => item.trim())
    .filter(Boolean);

  if (normalizedImports.length === 0) return "";

  const packageName =
    page.value?.meteor?.packageName || DEFAULT_COMPONENT_PACKAGE;

  if (normalizedImports.length === 1) {
    return `import { ${normalizedImports[0]} } from "${packageName}";`;
  }

  return `import {\n  ${normalizedImports.join(",\n  ")},\n} from "${packageName}";`;
});

const codeFence = computed(() =>
  importCode.value ? `\`\`\`ts\n${importCode.value}\n\`\`\`` : "",
);
</script>
