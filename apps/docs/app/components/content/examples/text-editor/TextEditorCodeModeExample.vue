<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";

const content = ref("<p>Editor starting in code mode</p>");
</script>

<template>
  <mt-text-editor v-model="content" :code-mode="true" />
</template>
