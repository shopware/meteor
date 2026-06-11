<template>
  <mt-button variant="secondary">
    <template #iconFront="{ size }">
      <mt-icon name="regular-plus-xs" :size="size" />
    </template>
    Add product
  </mt-button>
</template>

<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
</script>
