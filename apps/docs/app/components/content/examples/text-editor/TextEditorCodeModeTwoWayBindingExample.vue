<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";

const content = ref("<p>Toggle between modes programmatically</p>");
const isCodeMode = ref(false);
</script>

<template>
  <div>
    <mt-button @click="isCodeMode = !isCodeMode">
      Toggle Mode (Currently: {{ isCodeMode ? "Code" : "WYSIWYG" }})
    </mt-button>
    <mt-text-editor v-model="content" v-model:code-mode="isCodeMode" />
  </div>
</template>
