<script setup lang="ts">
import MtCheckbox from "@shopware-ag/meteor-component-library/MtCheckbox";
</script>

<template>
  <mt-checkbox label="Unchecked" />
  <mt-checkbox label="Checked" :model-value="true" />
  <mt-checkbox label="Disabled" disabled :model-value="true" />
  <mt-checkbox label="Partial selection" :model-value="false" partial />
</template>
