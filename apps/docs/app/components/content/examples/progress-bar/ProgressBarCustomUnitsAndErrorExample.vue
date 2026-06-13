<script setup lang="ts">
import { ref } from "vue";
import MtProgressBar from "@shopware-ag/meteor-component-library/MtProgressBar";

const uploadedSize = ref(277);
</script>

<template>
  <mt-progress-bar
    v-model="uploadedSize"
    :max-value="356"
    label="Upload progress"
    progress-label-type="kb"
    :error="{ code: 500, detail: 'Error while loading' }"
  />
</template>
