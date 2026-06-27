<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";

const content = ref("<p>Inline editing example</p>");
</script>

<template>
  <mt-text-editor v-model="content" :is-inline-edit="true" />
</template>
