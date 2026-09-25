<script setup lang="ts">
import MtThemeSelect from "@shopware-ag/meteor-component-library/MtThemeSelect";
import { useTheme } from "@shopware-ag/meteor-component-library";

const { theme } = useTheme();
</script>

<template>
  <mt-theme-select v-model="theme" label="Color theme" />
</template>
