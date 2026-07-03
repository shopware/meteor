<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtEmailField from "@shopware-ag/meteor-component-library/MtEmailField";
import MtPasswordField from "@shopware-ag/meteor-component-library/MtPasswordField";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtLink from "@shopware-ag/meteor-component-library/MtLink";

const email = ref("mia.chen@company.io");
const password = ref("bananenstarkespasswort");
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card>
    <div class="connect">
      <div class="connect__logos">
        <span class="connect__logo connect__logo--sw">
          <mt-icon
            name="solid-shopware"
            size="20"
            color="var(--color-static-white)"
          />
        </span>
        <span class="connect__logo connect__logo--nx">
          <mt-icon
            name="solid-shopware-nexus"
            size="20"
            color="var(--color-icon-brand-default)"
          />
        </span>
      </div>
      <div class="connect__body">
        <div class="connect__head">
          <mt-text size="l" weight="bold">Connect to Nexus</mt-text>
          <mt-text size="xs" :color="muted">
            Sign in with your Shopware account to connect Nexus and turn every
            store event into an automated workflow, the moment it happens.
          </mt-text>
        </div>
        <mt-email-field v-model="email" label="Email" />
        <mt-password-field v-model="password" label="Password" />
        <mt-button variant="primary" size="large" block>Continue</mt-button>
        <div class="connect__footer">
          <mt-text size="xs" :color="muted"> Don't have an account? </mt-text>
          <mt-link as="a" href="#">Register now</mt-link>
        </div>
      </div>
    </div>
  </mt-card>
</template>

<style scoped>
/* Top logos section, then the form content — 24px between the two. */
.connect {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}
/* Two overlapping brand circles, each ringed in the card surface so the overlap
   reads cleanly against the raised card. */
.connect__logos {
  display: flex;
  align-items: center;
}
.connect__logo {
  display: grid;
  place-items: center;
  width: var(--scale-size-48);
  height: var(--scale-size-48);
  border-radius: var(--border-radius-round);
  border: 2px solid var(--color-elevation-surface-raised);
  flex-shrink: 0;
}
.connect__logo--sw {
  background: var(--color-icon-brand-default);
}
.connect__logo--nx {
  background: var(--color-background-tertiary-default);
  margin-left: calc(var(--scale-size-12) * -1);
}
/* Headline + description, the two fields, and the Continue button. */
.connect__body {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
.connect__head {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  /* +8px beyond the body's 16px gap → 24px down to the first field. */
  margin-bottom: var(--scale-size-8);
}
/* +16px beyond the body's 16px gap → 32px up from the last field to the button. */
.connect__body :deep(.mt-button) {
  margin-top: var(--scale-size-16);
}
.connect__footer {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);
}
</style>
