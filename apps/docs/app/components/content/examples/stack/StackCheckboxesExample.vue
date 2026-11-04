<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtCheckbox from "@shopware-ag/meteor-component-library/MtCheckbox";
import MtStack from "@shopware-ag/meteor-component-library/MtStack";
</script>

<template>
  <mt-card title="Notifications">
    <mt-stack gap="scale-size-8">
      <mt-checkbox label="Order placed" />
      <mt-checkbox label="Order shipped" />
      <mt-checkbox label="Order cancelled" />
    </mt-stack>
  </mt-card>
</template>
