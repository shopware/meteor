<script setup lang="ts">
// Overrides Docus' default DocsAsideLeftBody to make the sidebar accordion
// open one section at a time (`type="single"`) and auto-expand the section
// containing the current page on load (`default-open`). Docus exposes no
// config for these UContentNavigation props, so the component is overridden.
const { sidebarNavigation } = useSubNavigation();
</script>

<template>
  <UContentNavigation
    type="single"
    :default-open="true"
    :highlight="true"
    variant="pill"
    :navigation="sidebarNavigation"
  />
</template>
