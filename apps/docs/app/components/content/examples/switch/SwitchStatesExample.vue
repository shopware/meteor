<script setup lang="ts">
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
</script>

<template>
  <mt-switch :model-value="false" label="Off" />
  <mt-switch :model-value="true" label="On" />
  <mt-switch :model-value="true" label="Disabled" :disabled="true" />
</template>
