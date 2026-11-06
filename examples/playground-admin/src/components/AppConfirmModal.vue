<script setup lang="ts">
import {
  MtButton,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtText,
} from "@shopware-ag/meteor-component-library";
import { useConfirmHost } from "../composables/useConfirm";

const { request, answer } = useConfirmHost();

function onChange(open: boolean) {
  if (!open) answer(false);
}
</script>

<template>
  <mt-modal-root :is-open="request !== null" @change="onChange">
    <mt-modal v-if="request" :title="request.title" width="s">
      <mt-text size="xs">{{ request.text }}</mt-text>

      <template #footer>
        <div class="actions">
          <mt-modal-close :as="MtButton" variant="secondary" size="default">
            {{ request.cancelLabel }}
          </mt-modal-close>
          <mt-modal-action
            :as="MtButton"
            :variant="request.variant ?? 'primary'"
            size="default"
            @click="answer(true)"
          >
            {{ request.confirmLabel }}
          </mt-modal-action>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>
