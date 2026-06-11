<script setup lang="ts">
const appConfig = useAppConfig();
const { hasLogo, headerLightUrl, headerDarkUrl, contextMenuItems } =
  useLogoAssets();

const logoLightUrl = computed(
  () => headerLightUrl.value || "/shopware-logo.svg",
);
const logoDarkUrl = computed(() => headerDarkUrl.value || "/shopware-logo.svg");
const logoAlt = computed(
  () => appConfig.header?.logo?.alt || appConfig.header?.title || "Shopware",
);
const logoClass = computed(() => [
  "h-7 w-auto shrink-0",
  appConfig.header?.logo?.class,
]);
</script>

<template>
  <UContextMenu v-if="hasLogo" :items="contextMenuItems">
    <UColorModeImage
      :light="logoLightUrl"
      :dark="logoDarkUrl"
      :alt="logoAlt"
      :class="logoClass"
    />
  </UContextMenu>
  <UColorModeImage
    v-else
    :light="logoLightUrl"
    :dark="logoDarkUrl"
    :alt="logoAlt"
    :class="logoClass"
  />
</template>
