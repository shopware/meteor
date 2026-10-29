<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { exampleKey } from "#shared/utils/exampleKey";
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";

// A block on its own, without the docs around it. BlockPreview renders this
// page in an iframe, so the block gets a real viewport.
definePageMeta({ layout: false, header: false, footer: false });

const route = useRoute();
const pascalName = exampleKey(String(route.params.name));

const blockModules = import.meta.glob("~/components/content/blocks/**/*.vue");
const blockMatch = Object.entries(blockModules).find(([path]) =>
  path.endsWith(`/${pascalName}.vue`),
);

if (!blockMatch) {
  throw createError({
    statusCode: 404,
    statusMessage: "Block not found",
    fatal: true,
  });
}

const block = defineAsyncComponent(blockMatch[1] as never);

// The links of a block lead to routes of the application it is copied into,
// not of the docs, so the preview stays on the block.
onBeforeRouteLeave(() => false);

useSeoMeta({ robots: "noindex, nofollow" });
useHead({ htmlAttrs: { class: "block-preview-document" } });

// The docs page around the iframe stores its theme under the colorMode
// storageKey (nuxt.config.ts). Follow it when it changes.
const colorMode = useColorMode();
useEventListener("storage", (event) => {
  if (event.key === "mt-theme" && event.newValue) {
    colorMode.preference = event.newValue;
  }
});
</script>

<template>
  <div class="block-preview-page">
    <ClientOnly>
      <MtThemeProvider :future="{ all: true }">
        <component :is="block" />
      </MtThemeProvider>
    </ClientOnly>
  </div>
</template>

<style scoped>
.block-preview-page {
  height: 100dvh;
  background-color: var(--color-elevation-surface-default);
}
</style>
