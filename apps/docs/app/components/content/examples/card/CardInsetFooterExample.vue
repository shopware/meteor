<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-card title="Customer details">
    <p>Use inset footer content when the footer should stretch edge to edge.</p>

    <template #footer>
      <mt-inset
        style="
          background: var(--color-elevation-surface-sunken);
          padding: var(--mt-card-footer-padding);
        "
      >
        <mt-text as="h3" size="m" weight="bold">Footer content</mt-text>

        <mt-text>
          The inset keeps the footer aligned with the card's own spacing while
          allowing a full-width surface treatment inside the footer area.
        </mt-text>
      </mt-inset>
    </template>
  </mt-card>
</template>
