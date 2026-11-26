<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtDivider from "@shopware-ag/meteor-component-library/MtDivider";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtGridItem from "@shopware-ag/meteor-component-library/MtGridItem";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";
import MtTextarea from "@shopware-ag/meteor-component-library/MtTextarea";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Product">
    <mt-grid>
      <mt-text-field label="Name" />
      <mt-text-field label="Product number" />
      <mt-grid-item span="full">
        <mt-textarea label="Description" />
      </mt-grid-item>
      <mt-grid-item span="full">
        <mt-divider />
      </mt-grid-item>
      <mt-number-field label="Price" />
      <mt-number-field label="Tax rate" />
    </mt-grid>
  </mt-card>
</template>
