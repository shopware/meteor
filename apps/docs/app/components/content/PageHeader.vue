<template>
  <div class="page-header">
    <h1 v-if="title" class="page-header__title">
      {{ title }}
      <span v-if="tagName" class="page-header__tag">({{ tagName }})</span>
    </h1>
    <p v-else-if="tagName" class="page-header__tag">{{ tagName }}</p>

    <div v-if="showStatusRow" class="page-header__status-row">
      <div v-if="variant" class="page-header__status">
        <span class="page-header__status-label">Status:</span>
        <span
          class="page-header__badge"
          :class="`page-header__badge--${resolvedStatus}`"
        >
          <span aria-hidden="true" class="page-header__indicator" />
          {{ variant.label }}
        </span>
      </div>
      <a
        v-for="(link, index) in links"
        :key="link.key"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="page-header__link"
        :class="{ 'page-header__link--first': !variant && index === 0 }"
      >
        {{ link.label }}
      </a>
    </div>

    <div v-if="$slots.default" class="page-header__description">
      <slot />
    </div>

    <pre
      v-if="importCode"
      class="page-header__code"
    ><code>{{ importCode }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    tagName?: string;
    status?: "available" | "experimental" | "deprecated" | "none";
    packageImports?: string | string[];
    packageName?: string;
    sourcePath?: string;
    sourceUrl?: string;
    npmPackage?: string;
  }>(),
  {
    status: "none",
    packageName: "@shopware-ag/meteor-component-library",
  },
);

const STATUS_VARIANTS = {
  available: { label: "Available" },
  experimental: { label: "Experimental" },
  deprecated: { label: "Deprecated" },
} as const;

const GITHUB_TREE_URL = "https://github.com/shopware/meteor/tree/main";
const NPM_PACKAGE_URL = "https://www.npmjs.com/package/";

const resolvedStatus = computed(() =>
  props.status === "none"
    ? null
    : props.status in STATUS_VARIANTS
      ? props.status
      : "available",
);
const variant = computed(() =>
  resolvedStatus.value
    ? STATUS_VARIANTS[resolvedStatus.value as keyof typeof STATUS_VARIANTS]
    : null,
);

const resolvedSourceUrl = computed(
  () =>
    props.sourceUrl ??
    (props.sourcePath ? `${GITHUB_TREE_URL}/${props.sourcePath}` : null),
);
const npmUrl = computed(() =>
  props.npmPackage ? `${NPM_PACKAGE_URL}${props.npmPackage}` : null,
);

const links = computed(() =>
  [
    resolvedSourceUrl.value
      ? { key: "github", href: resolvedSourceUrl.value, label: "GitHub" }
      : null,
    npmUrl.value ? { key: "npm", href: npmUrl.value, label: "npm" } : null,
  ].filter(
    (link): link is { key: string; href: string; label: string } =>
      link !== null,
  ),
);

const showStatusRow = computed(() =>
  Boolean(variant.value || links.value.length),
);

const importCode = computed(() => {
  if (!props.packageImports) return null;
  const imports = Array.isArray(props.packageImports)
    ? props.packageImports
    : props.packageImports.split(",").map((s) => s.trim());
  if (imports.length === 1) {
    return `import { ${imports[0]} } from "${props.packageName}";`;
  }
  return `import {\n  ${imports.join(",\n  ")},\n} from "${props.packageName}";`;
});
</script>

<style scoped>
.page-header {
  margin: 0.75rem 0;
}

.page-header__title {
  font-size: var(--font-size-3xl);
  line-height: var(--font-line-height-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary-default);
  margin: 0;
}

.page-header__tag {
  color: var(--color-text-secondary-default);
  font-weight: var(--font-weight-regular);
  margin-left: 0.25em;
}

.page-header__status-row {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.page-header__status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.page-header__status-label {
  font-size: 15px;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary-default);
}

.page-header__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 1.25rem;
  padding: 0 0.5rem;
  border-radius: var(--border-radius-round);
  font-size: 13px;
  line-height: 1.125rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
  border: 1px solid;
}

.page-header__badge--available {
  background-color: var(--color-background-positive-default);
  border-color: var(--color-border-positive-default);
}

.page-header__badge--available .page-header__indicator {
  background-color: var(--color-icon-positive-default);
}

.page-header__badge--experimental {
  background-color: var(--color-background-attention-default);
  border-color: var(--color-border-attention-default);
}

.page-header__badge--experimental .page-header__indicator {
  background-color: var(--color-icon-attention-default);
}

.page-header__badge--deprecated {
  background-color: var(--color-background-critical-default);
  border-color: var(--color-border-critical-default);
}

.page-header__badge--deprecated .page-header__indicator {
  background-color: var(--color-icon-critical-default);
}

.page-header__indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.page-header__link {
  border-left: 1px solid var(--color-border-secondary-default);
  color: var(--color-text-brand-default);
  padding-left: 1rem;
  text-decoration: underline;
  font-size: 15px;
}

.page-header__link--first {
  border-left: none;
  padding-left: 0;
}

.page-header__description {
  margin-top: 0.75rem;
}

.page-header__code {
  margin-top: 0.75rem;
  padding: var(--scale-size-12) var(--scale-size-16);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  background-color: var(--color-background-secondary-default);
  font-size: var(--font-size-2xs);
  color: var(--color-text-primary-default);
  overflow-x: auto;
}
</style>
