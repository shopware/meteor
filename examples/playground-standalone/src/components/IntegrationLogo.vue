<script lang="ts">
// The app loads SVG files as their markup.
import adyen from "../assets/adyen.svg";
import airtable from "../assets/airtable.svg";
import asana from "../assets/asana.svg";
import aws from "../assets/aws.svg";
import box from "../assets/box.svg";
import brevo from "../assets/brevo.svg";
import claude from "../assets/claude.svg";
import discord from "../assets/discord.svg";
import dropbox from "../assets/dropbox.svg";
import gmail from "../assets/gmail.svg";
import googleAds from "../assets/google-ads.svg";
import googleAnalytics from "../assets/google-analytics.svg";
import googleDrive from "../assets/google-drive.svg";
import hubspot from "../assets/hubspot.svg";
import jira from "../assets/jira.svg";
import linear from "../assets/linear.svg";
import mailgun from "../assets/mailgun.svg";
import microsoft from "../assets/microsoft.svg";
import mixpanel from "../assets/mixpanel.svg";
import mongodb from "../assets/mongodb.svg";
import odoo from "../assets/odoo.svg";
import paypal from "../assets/paypal.svg";
import pimcore from "../assets/pimcore.svg";
import salesforce from "../assets/salesforce.svg";
import sap from "../assets/sap.svg";
import shopware from "../assets/shopware.svg";
import slack from "../assets/slack.svg";
import trello from "../assets/trello.svg";
import twilio from "../assets/twilio.svg";
import whatsapp from "../assets/whatsapp.svg";

const logos = {
  adyen,
  airtable,
  asana,
  aws,
  box,
  brevo,
  claude,
  discord,
  dropbox,
  gmail,
  googleAds,
  googleAnalytics,
  googleDrive,
  hubspot,
  jira,
  linear,
  mailgun,
  microsoft,
  mixpanel,
  mongodb,
  odoo,
  paypal,
  pimcore,
  salesforce,
  sap,
  shopware,
  slack,
  trello,
  twilio,
  whatsapp,
};

/** The brands with a logo file in `src/assets`. */
export type Brand = keyof typeof logos;
</script>

<script setup lang="ts">
import { MtIcon } from "@shopware-ag/meteor-component-library";

defineProps<{
  /** The brand whose logo is shown. */
  brand?: Brand;
  /** An icon of the icon kit, for a service without a logo file. */
  icon?: string;
  /** A smaller frame, for lists. */
  small?: boolean;
}>();
</script>

<template>
  <!-- Decorative: the name of the service is always next to it or in visually hidden text. -->
  <span
    class="integration-logo"
    :class="{ 'integration-logo--small': small }"
    aria-hidden="true"
  >
    <!-- The logos are the app's own SVG files. -->
    <span v-if="brand" class="integration-logo__svg" v-html="logos[brand]" />
    <mt-icon
      v-else-if="icon"
      :name="icon"
      :size="small ? 'var(--scale-size-16)' : 'var(--scale-size-20)'"
      decorative
    />
  </span>
</template>

<style scoped>
.integration-logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-s);
  background: var(--color-background-primary-default);
}

.integration-logo__svg {
  display: flex;
}

/* Half the frame, as the step icons in the workflow table. */
.integration-logo__svg :deep(svg) {
  width: var(--scale-size-20);
  height: var(--scale-size-20);
}

.integration-logo--small {
  width: var(--scale-size-32);
  height: var(--scale-size-32);
}

.integration-logo--small .integration-logo__svg :deep(svg) {
  width: var(--scale-size-16);
  height: var(--scale-size-16);
}
</style>
