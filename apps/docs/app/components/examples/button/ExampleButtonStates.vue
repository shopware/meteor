<template>
  <mt-button>Default</mt-button>
  <mt-button :disabled="true">Disabled</mt-button>
  <mt-button :is-loading="true">Loading</mt-button>
</template>

<script setup lang="ts">
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
</script>
