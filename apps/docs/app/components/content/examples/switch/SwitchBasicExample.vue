<script setup lang="ts">
import { ref } from "vue";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";

const enabled = ref(false);
</script>

<template>
  <mt-switch v-model="enabled" label="Switchfield" />
</template>
