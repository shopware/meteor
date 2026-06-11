<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale, isEnabled } = useDocusI18n();

const collectionName = computed(() =>
  isEnabled.value ? `landing_${locale.value}` : "landing",
);

const { data: page } = await useAsyncData(
  () => `${collectionName.value}-index`,
  async () => {
    const collection = collectionName.value as keyof Collections;

    return (
      (await queryCollection(collection).path(route.path).first()) ||
      (await queryCollection(collection).path("/index").first())
    );
  },
  {
    watch: [collectionName],
  },
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

useSeo({
  title,
  description,
  type: "website",
  ogImage: page.value?.seo?.ogImage as string | undefined,
});

if (!page.value?.seo?.ogImage) {
  defineOgImage("Landing", {
    title: title?.slice(0, 60),
    description: formatOgDescription(title, description),
  });
}
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
