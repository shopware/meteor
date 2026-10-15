<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Customer">
    <mt-grid :columns="3">
      <mt-text-field label="Salutation" />
      <mt-text-field label="First name" />
      <mt-text-field label="Last name" />
      <mt-text-field label="Email" />
      <mt-text-field label="Phone" />
      <mt-text-field label="Company" />
    </mt-grid>
  </mt-card>
</template>
