<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtDrawerContent from "@shopware-ag/meteor-component-library/MtDrawerContent";
import MtDrawerRoot from "@shopware-ag/meteor-component-library/MtDrawerRoot";
import MtDrawerTrigger from "@shopware-ag/meteor-component-library/MtDrawerTrigger";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <div class="drawer-sides">
    <mt-drawer-root>
      <mt-drawer-trigger :as="MtButton" variant="secondary">Start</mt-drawer-trigger>
      <mt-drawer-content title="Filters" side="start" size="20rem">
        <mt-text size="xs">Slides in from the start edge.</mt-text>
      </mt-drawer-content>
    </mt-drawer-root>

    <mt-drawer-root>
      <mt-drawer-trigger :as="MtButton" variant="secondary">End</mt-drawer-trigger>
      <mt-drawer-content title="Details" side="end" size="20rem">
        <mt-text size="xs">Slides in from the end edge.</mt-text>
      </mt-drawer-content>
    </mt-drawer-root>

    <mt-drawer-root>
      <mt-drawer-trigger :as="MtButton" variant="secondary">Top</mt-drawer-trigger>
      <mt-drawer-content title="Announcement" side="top">
        <mt-text size="xs">Slides in from the top edge.</mt-text>
      </mt-drawer-content>
    </mt-drawer-root>

    <mt-drawer-root>
      <mt-drawer-trigger :as="MtButton" variant="secondary">Bottom</mt-drawer-trigger>
      <mt-drawer-content title="Selection" side="bottom">
        <mt-text size="xs">Slides in from the bottom edge.</mt-text>
      </mt-drawer-content>
    </mt-drawer-root>
  </div>
</template>

<style scoped>
.drawer-sides {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-8);
}
</style>
