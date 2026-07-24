<script setup lang="ts">
import MtModalRoot from "@shopware-ag/meteor-component-library/MtModalRoot";
import MtModal from "@shopware-ag/meteor-component-library/MtModal";
import MtModalTrigger from "@shopware-ag/meteor-component-library/MtModalTrigger";
import MtModalClose from "@shopware-ag/meteor-component-library/MtModalClose";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
</script>

<template>
  <mt-modal-root>
    <mt-modal-trigger :as="MtButton">Open modal</mt-modal-trigger>

    <mt-modal title="Modal Title">
      <template #default>Modal content</template>

      <template #footer>
        <div style="display: flex; justify-content: flex-end">
          <mt-modal-close :as="MtButton" variant="secondary">Close</mt-modal-close>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>
