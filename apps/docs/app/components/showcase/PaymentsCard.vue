<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card>
    <div class="payments">
      <!-- Faked header: icon tile + title/subtitle, no bottom border. -->
      <div class="payments__header">
        <div class="payments__avatar">
          <mt-icon
            name="solid-shopware-payments"
            size="28"
            color="var(--color-static-white)"
          />
        </div>
        <div class="payments__titles">
          <mt-text size="s" weight="semibold">Shopware Payments</mt-text>
          <mt-text size="xs" :color="muted"
            >Modern, full-stack payments solution.</mt-text
          >
        </div>
      </div>

      <mt-text size="xs" :color="muted">
        Payouts, refunds, and disputes managed from a single dashboard, with
        settlement reporting and automatic reconciliation built in.
      </mt-text>
    </div>
  </mt-card>
</template>

<style scoped>
.payments {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
.payments__header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}
/* Branded, rounded icon tile standing in for the card avatar. */
.payments__avatar {
  display: grid;
  place-items: center;
  width: var(--scale-size-48);
  height: var(--scale-size-48);
  border-radius: var(--border-radius-l);
  background: var(--color-icon-brand-default);
  flex-shrink: 0;
}
.payments__titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
