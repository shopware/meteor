<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtButton,
  MtDrawerContent,
  MtDrawerRoot,
  MtDrawerTrigger,
  MtModal,
  MtModalRoot,
  MtText,
  MtTextField,
} from "@shopware-ag/meteor-component-library";

const open = ref(false);
const confirmOpen = ref(false);
const customer = ref("");
const isDirty = computed(() => customer.value !== "");

function close() {
  confirmOpen.value = false;
  open.value = false;
  customer.value = "";
}
</script>

<template>
  <mt-drawer-root
    v-model:open="open"
    :dismissible="!isDirty"
    @dismiss-prevented="confirmOpen = true"
  >
    <mt-drawer-trigger :as="MtButton" variant="secondary">
      Edit order
    </mt-drawer-trigger>

    <mt-drawer-content title="Edit order" size="24rem">
      <mt-text-field v-model="customer" label="Customer" />

      <template #footer>
        <mt-button variant="primary" @click="close">Save</mt-button>
      </template>
    </mt-drawer-content>
  </mt-drawer-root>

  <mt-modal-root :is-open="confirmOpen" @change="confirmOpen = $event">
    <mt-modal title="Discard changes?" width="s">
      <mt-text size="xs">The changes to this order are not saved yet.</mt-text>

      <template #footer>
        <div class="drawer-confirm__actions">
          <mt-button variant="secondary" @click="confirmOpen = false">
            Keep editing
          </mt-button>
          <mt-button variant="critical" @click="close">
            Discard changes
          </mt-button>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<style scoped>
.drawer-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
