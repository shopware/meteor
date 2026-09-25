<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtDrawerClose from "@shopware-ag/meteor-component-library/MtDrawerClose";
import MtDrawerContent from "@shopware-ag/meteor-component-library/MtDrawerContent";
import MtDrawerRoot from "@shopware-ag/meteor-component-library/MtDrawerRoot";
import MtDrawerTrigger from "@shopware-ag/meteor-component-library/MtDrawerTrigger";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-drawer-root>
    <mt-drawer-trigger :as="MtButton" variant="secondary">
      Show order
    </mt-drawer-trigger>

    <mt-drawer-content title="Order details" subtitle="#10042" size="24rem">
      <mt-text size="xs">Shipped to Jane Doe, Berlin.</mt-text>

      <template #footer>
        <mt-drawer-close :as="MtButton" variant="secondary">
          Close
        </mt-drawer-close>
      </template>
    </mt-drawer-content>
  </mt-drawer-root>
</template>
