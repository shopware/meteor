<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtStack from "@shopware-ag/meteor-component-library/MtStack";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
</script>

<template>
  <mt-card title="Options">
    <mt-stack gap="scale-size-16">
      <mt-switch label="Active" bordered />
      <mt-switch label="Show in navigation" bordered />
      <mt-switch label="Allow reviews" bordered />
    </mt-stack>
  </mt-card>
</template>
