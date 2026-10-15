<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Shipping">
    <mt-grid>
      <mt-text-field label="Delivery time" />
      <mt-number-field label="Restock time in days" />
      <mt-text-field label="Minimum order quantity" />
      <mt-text-field label="Purchase steps" />
      <mt-text-field label="Maximum order quantity" />
      <mt-switch label="Free shipping" bordered />
    </mt-grid>
  </mt-card>
</template>
