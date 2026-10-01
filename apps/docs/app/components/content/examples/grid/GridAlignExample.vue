<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Category">
    <mt-grid align="start">
      <mt-text-field label="Name" hint="Shown in the navigation" />
      <mt-switch label="Active" bordered />
    </mt-grid>
  </mt-card>
</template>
