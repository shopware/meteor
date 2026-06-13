<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";

const content = ref('<div class="box" data-custom="123">\n  <p>Content</p>\n</div>');
</script>

<template>
  <mt-text-editor v-model="content" label="My Text editor" />
</template>
