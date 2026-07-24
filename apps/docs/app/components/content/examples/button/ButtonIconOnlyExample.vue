<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
</script>

<template>
  <mt-button variant="secondary" :square="true" aria-label="Add item">
    <template #iconFront="{ size }">
      <mt-icon name="regular-plus-xs" :size="size" />
    </template>
  </mt-button>
</template>
