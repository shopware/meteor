<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Address">
    <mt-grid row-gap="scale-size-16" column-gap="scale-size-24">
      <mt-text-field label="Street" />
      <mt-text-field label="House number" />
      <mt-text-field label="Zip code" />
      <mt-text-field label="City" />
    </mt-grid>
  </mt-card>
</template>
