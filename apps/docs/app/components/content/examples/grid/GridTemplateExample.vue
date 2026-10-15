<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtGrid from "@shopware-ag/meteor-component-library/MtGrid";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Access key">
    <mt-grid columns="1fr auto">
      <mt-text-field
        label="API access key"
        model-value="SWSC3VJ4S3O3MHAZ"
        disabled
      />
      <mt-button variant="secondary">Generate new</mt-button>
    </mt-grid>
  </mt-card>
</template>
