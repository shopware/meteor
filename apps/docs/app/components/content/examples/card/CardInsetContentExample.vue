<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-card title="Customer details">
    <mt-inset>
      <mt-text as="h3" size="m" weight="bold">Headline</mt-text>

      <mt-text>
        Use inset content when the inner block should visually extend to the
        card edges while still respecting the card's own spacing tokens.
      </mt-text>
    </mt-inset>
  </mt-card>
</template>
