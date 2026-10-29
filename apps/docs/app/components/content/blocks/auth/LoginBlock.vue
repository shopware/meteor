<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtBanner,
  MtButton,
  MtCard,
  MtCheckbox,
  MtIcon,
  MtLink,
  MtPasswordField,
  MtText,
  MtTextField,
} from "@shopware-ag/meteor-component-library";

const username = ref("");
const password = ref("");
const keepLoggedIn = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const canSubmit = computed(() => username.value.length > 0 && password.value.length > 0);

function login() {
  isLoading.value = true;
  errorMessage.value = "";

  // Replace the timeout with the request to your authentication endpoint.
  setTimeout(() => {
    isLoading.value = false;
    errorMessage.value = "Incorrect username or password.";
  }, 800);
}
</script>

<template>
  <div class="login">
    <mt-icon
      name="regular-shopware"
      size="var(--scale-size-48)"
      color="var(--color-icon-brand-default)"
      decorative
    />

    <mt-card :is-loading="isLoading">
      <form class="login__form" @submit.prevent="login">
        <mt-text as="h1" size="2xl" weight="semibold">Log in</mt-text>

        <mt-text-field v-model="username" label="Username" autocomplete="username" required />

        <mt-password-field
          v-model="password"
          label="Password"
          autocomplete="current-password"
          required
        />

        <mt-banner v-if="errorMessage" variant="critical">{{ errorMessage }}</mt-banner>

        <mt-checkbox v-model="keepLoggedIn" label="Keep me logged in" />

        <mt-button variant="primary" size="default" type="submit" block :disabled="!canSubmit">
          Log in
        </mt-button>
      </form>
    </mt-card>

    <mt-link as="a" href="#">Forgot password?</mt-link>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  grid-template-columns: minmax(0, 27rem);
  place-content: center;
  justify-items: center;
  gap: var(--scale-size-32);
  min-height: 100%;
  padding: var(--scale-size-20);
  background-color: var(--color-elevation-surface-sunken);
}

.login :deep(.mt-card) {
  justify-self: stretch;
}

.login__form {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
