<script setup lang="ts">
import { ref } from "vue";
import {
  MtButton,
  MtCard,
  MtEmailField,
  MtIcon,
  MtLink,
  MtText,
} from "@shopware-ag/meteor-component-library";

const email = ref("");
const isLoading = ref(false);
const isSent = ref(false);

function requestLink() {
  isLoading.value = true;

  // Replace the timeout with the request that sends the link to reset the password.
  setTimeout(() => {
    isLoading.value = false;
    isSent.value = true;
  }, 800);
}
</script>

<template>
  <div class="reset">
    <mt-icon
      name="regular-shopware"
      size="var(--scale-size-48)"
      color="var(--color-icon-brand-default)"
      decorative
    />

    <mt-card :is-loading="isLoading">
      <form v-if="!isSent" class="reset__form" @submit.prevent="requestLink">
        <mt-text as="h1" size="2xl" weight="semibold">Reset password</mt-text>
        <mt-text size="xs" color="color-text-secondary-default">
          Enter the email address of your account, and we send you a link to set a new password.
        </mt-text>

        <mt-email-field v-model="email" label="Email address" autocomplete="email" required />

        <mt-button variant="primary" size="default" type="submit" block :disabled="!email">
          Send link
        </mt-button>
      </form>

      <!-- The same message whether the account exists or not, so it doesn't reveal accounts. -->
      <div v-else class="reset__form" role="status">
        <mt-text as="h1" size="2xl" weight="semibold">Check your inbox</mt-text>
        <mt-text size="xs" color="color-text-secondary-default">
          If an account exists for {{ email }}, a link to set a new password is on its way. It can
          take a few minutes to arrive.
        </mt-text>

        <mt-button variant="secondary" size="default" block @click="isSent = false">
          Use another email address
        </mt-button>
      </div>
    </mt-card>

    <mt-link as="a" href="#">Back to login</mt-link>
  </div>
</template>

<style scoped>
.reset {
  display: grid;
  grid-template-columns: minmax(0, 27rem);
  place-content: center;
  justify-items: center;
  gap: var(--scale-size-32);
  min-height: 100%;
  padding: var(--scale-size-20);
  background-color: var(--color-elevation-surface-sunken);
}

.reset :deep(.mt-card) {
  justify-self: stretch;
}

.reset__form {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
