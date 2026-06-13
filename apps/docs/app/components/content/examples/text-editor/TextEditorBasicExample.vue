<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";

const content = ref("<p>Your content here</p>");
</script>

<template>
  <mt-text-editor v-model="content" />
</template>
