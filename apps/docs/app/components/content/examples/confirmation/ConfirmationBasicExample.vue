<script setup lang="ts">
import { ref } from "vue";
import {
  MtButton,
  MtConfirmation,
  MtConfirmationAccepted,
  MtConfirmationAction,
  MtConfirmationActions,
  MtConfirmationRejected,
  MtConfirmationRequest,
  MtConfirmationTitle,
  type MtToolApproval,
  type MtToolState,
} from "@shopware-ag/meteor-component-library";

// In an app, these are the `state` and `approval` of the AI SDK tool part.
const state = ref<MtToolState>("approval-requested");
const approval = ref<MtToolApproval>({ id: "approval-1" });

// With the AI SDK, call `addToolApprovalResponse({ id: approval.id, approved })` instead.
function answer(approved: boolean) {
  approval.value = { ...approval.value, approved };
  state.value = approved ? "output-available" : "output-denied";
}

function reset() {
  approval.value = { id: "approval-1" };
  state.value = "approval-requested";
}
</script>

<template>
  <div class="confirmation-example">
    <mt-confirmation :state="state" :approval="approval">
      <mt-confirmation-title>Change the stock?</mt-confirmation-title>
      <mt-confirmation-request>Set the stock of SW-1012 to 40.</mt-confirmation-request>
      <mt-confirmation-accepted>You approved the stock change.</mt-confirmation-accepted>
      <mt-confirmation-rejected>You declined the stock change.</mt-confirmation-rejected>
      <mt-confirmation-actions>
        <mt-confirmation-action @click="answer(false)">Decline</mt-confirmation-action>
        <mt-confirmation-action variant="primary" @click="answer(true)">
          Approve
        </mt-confirmation-action>
      </mt-confirmation-actions>
    </mt-confirmation>

    <mt-button v-if="state !== 'approval-requested'" variant="secondary" @click="reset">
      Ask again
    </mt-button>
  </div>
</template>

<style scoped>
.confirmation-example {
  display: grid;
  gap: var(--scale-size-16);
  justify-items: start;
}

.confirmation-example > :first-child {
  justify-self: stretch;
}
</style>
