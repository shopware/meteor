<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtStack from "@shopware-ag/meteor-component-library/MtStack";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
</script>

<template>
  <mt-card title="Address">
    <mt-stack>
      <mt-text-field label="Street" />
      <mt-text-field label="City" />
      <mt-text-field label="Country" />
    </mt-stack>
  </mt-card>
</template>
