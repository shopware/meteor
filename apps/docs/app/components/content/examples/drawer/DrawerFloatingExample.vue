<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
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

    <mt-drawer-content title="Order details" variant="floating" size="24rem">
      <mt-text size="xs">Shipped to Jane Doe, Berlin.</mt-text>
    </mt-drawer-content>
  </mt-drawer-root>
</template>
