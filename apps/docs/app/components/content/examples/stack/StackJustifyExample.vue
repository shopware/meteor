<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtStack from "@shopware-ag/meteor-component-library/MtStack";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Shipping">
    <mt-stack>
      <mt-text-field label="Delivery time" />
      <mt-stack direction="horizontal" gap="scale-size-8" justify="end">
        <mt-button variant="secondary">Cancel</mt-button>
        <mt-button variant="primary">Save</mt-button>
      </mt-stack>
    </mt-stack>
  </mt-card>
</template>
