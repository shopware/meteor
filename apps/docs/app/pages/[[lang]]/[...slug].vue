<script setup lang="ts">
import { kebabCase } from "scule";
import type {
  ContentNavigationItem,
  Collections,
  DocsCollectionItem,
} from "@nuxt/content";
import { findPageHeadline } from "@nuxt/content/utils";

definePageMeta({
  layout: "docs",
});

const route = useRoute();
const { locale, isEnabled, t } = useDocusI18n();
const { isOpen } = useAssistant();
const appConfig = useAppConfig();
const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
const isInternalRoute = computed(() =>
  [
    "/api/",
    "/_",
    "/__",
    "/mcp",
    "/raw/",
    "/llms",
    "/robots",
    "/sitemap",
    "/site-config",
  ].some((prefix) => route.path.startsWith(prefix)),
);
const isAssetRoute = computed(() =>
  /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|png|svg|txt|webmanifest|webp|woff2?)$/i.test(
    route.path,
  ),
);
const collectionName = computed(() =>
  isEnabled.value ? `docs_${locale.value}` : "docs",
);

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(
    kebabCase(route.path),
    () =>
      queryCollection(collectionName.value as keyof Collections)
        .path(route.path)
        .first() as Promise<DocsCollectionItem>,
  ),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings(
      collectionName.value as keyof Collections,
      route.path,
      {
        fields: ["description"],
      },
    );
  }),
]);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: !(isInternalRoute.value || isAssetRoute.value),
  });
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;
type MeteorStatus = "available" | "experimental" | "deprecated" | "none";

const meteor = computed(
  () =>
    (
      page.value as DocsCollectionItem & {
        meteor?: { tagName?: string; status?: MeteorStatus };
      }
    ).meteor,
);
const statusBanner = computed(() => {
  const status = meteor.value?.status;

  if (status === "experimental") {
    return {
      color: "warning" as const,
      icon: "i-lucide-flask-conical",
      title: "Experimental component",
      description:
        "This component is still being evaluated. Its API or behavior may change before it is considered stable.",
    };
  }

  if (status === "deprecated") {
    return {
      color: "error" as const,
      icon: "i-lucide-triangle-alert",
      title: "Deprecated component",
      description:
        "This component is deprecated and should not be used for new work. Prefer the recommended replacement when one is available.",
    };
  }

  return null;
});

const headline = ref(findPageHeadline(navigation?.value, page.value?.path));
const breadcrumbs = computed(() =>
  findPageBreadcrumbs(navigation?.value, page.value?.path || ""),
);

useSeo({
  title,
  description,
  type: "article",
  modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as
    | string
    | undefined,
  breadcrumbs,
});
watch(
  () => navigation?.value,
  () => {
    headline.value =
      findPageHeadline(navigation?.value, page.value?.path) || headline.value;
  },
);

defineOgImage("Docs", {
  headline: headline.value,
  title: title?.slice(0, 60),
  description: formatOgDescription(title, description),
});

const github = computed(() => (appConfig.github ? appConfig.github : null));

const editLink = computed(() => {
  if (!github.value) {
    return;
  }

  return [
    github.value.url,
    "edit",
    github.value.branch,
    github.value.rootDir,
    "content",
    `${page.value?.stem}.${page.value?.extension}`,
  ]
    .filter(Boolean)
    .join("/");
});

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`);
</script>

<template>
  <UPage v-if="page" :ui="isOpen ? { center: 'lg:col-span-10' } : undefined">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <template #title>
        <span class="inline-flex flex-wrap items-baseline gap-x-2 gap-y-2">
          <span>{{ page.title }}</span>
          <span v-if="meteor?.tagName" class="text-muted font-normal">
            ({{ meteor.tagName }})
          </span>
        </span>
      </template>

      <template #links>
        <UButton
          v-for="(link, index) in (page as DocsCollectionItem).links"
          :key="index"
          size="sm"
          v-bind="link"
        />

        <DocsPageHeaderLinks />
      </template>
    </UPageHeader>

    <UAlert
      v-if="statusBanner"
      class="mt-8"
      variant="subtle"
      :color="statusBanner.color"
      :icon="statusBanner.icon"
      :title="statusBanner.title"
      :description="statusBanner.description"
    />

    <UPageBody>
      <ContentRenderer v-if="page" :value="page" />

      <USeparator v-if="github">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UButton
            variant="link"
            color="neutral"
            :to="editLink"
            target="_blank"
            icon="i-lucide-pen"
            :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t("docs.edit") }}
          </UButton>
          <template v-if="github?.url">
            <span>{{ t("common.or") }}</span>
            <UButton
              variant="link"
              color="neutral"
              :to="`${github.url}/issues/new/choose`"
              target="_blank"
              icon="i-lucide-alert-circle"
              :ui="{ leadingIcon: 'size-4' }"
            >
              {{ t("docs.report") }}
            </UButton>
          </template>
        </div>
      </USeparator>
      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="!isOpen" #right>
      <DocsAsideRight :page="page" />
    </template>
  </UPage>
</template>
