<script setup lang="ts">
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtModal from "@shopware-ag/meteor-component-library/MtModal";
import MtModalRoot from "@shopware-ag/meteor-component-library/MtModalRoot";
import MtModalTrigger from "@shopware-ag/meteor-component-library/MtModalTrigger";
import MtPopover from "@shopware-ag/meteor-component-library/MtPopover";
import MtPopoverItem from "@shopware-ag/meteor-component-library/MtPopoverItem";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import { useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();
</script>

<template>
  <mt-app
    class="app-overlays"
    :mobile-breakpoint="0"
    :apply-theme="false"
    :lock-document="false"
  >
    <template #header>
      <div class="app-overlays__header">
        <mt-text as="span" size="s" weight="bold">Meteor Shop</mt-text>

        <mt-popover title="Account">
          <template #trigger="{ toggleFloatingUi }">
            <mt-button
              variant="secondary"
              size="small"
              @click.stop="toggleFloatingUi"
            >
              Jane Doe
            </mt-button>
          </template>

          <template #popover-items__base>
            <mt-popover-item label="Profile" />
            <mt-popover-item label="Sign out" type="critical" />
          </template>
        </mt-popover>
      </div>
    </template>

    <template #content>
      <div class="app-overlays__content">
        <mt-button
          variant="primary"
          size="small"
          @click="addSnackbar({ message: 'Order saved', variant: 'success' })"
        >
          Show snackbar
        </mt-button>

        <mt-modal-root>
          <mt-modal-trigger :as="MtButton" variant="secondary" size="small">
            Open modal
          </mt-modal-trigger>

          <mt-modal title="Delete order">
            <mt-text size="xs">This action cannot be undone.</mt-text>

            <template #footer>
              <mt-button variant="critical" size="small">Delete</mt-button>
            </template>
          </mt-modal>
        </mt-modal-root>
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-overlays {
  --mt-app-height: 280px;

  border-radius: var(--border-radius-m);
}

.app-overlays__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--scale-size-48);
  padding-inline: var(--scale-size-16);
}

.app-overlays__content {
  display: flex;
  gap: var(--scale-size-8);
  padding: var(--scale-size-24);
}
</style>
