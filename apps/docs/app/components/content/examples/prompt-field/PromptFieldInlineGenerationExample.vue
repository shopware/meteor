<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  MtPromptField,
  MtTextarea,
  type MtChatStatus,
} from "@shopware-ag/meteor-component-library";

const description = ref("");
const status = ref<MtChatStatus>("ready");

let request: ReturnType<typeof setTimeout> | undefined;

function stop() {
  clearTimeout(request);
  status.value = "ready";
}

function generate() {
  status.value = "submitted";
  request = setTimeout(() => {
    description.value =
      "A handmade table lamp with a linen shade and a warm, dimmable light for calm living rooms.";
    stop();
  }, 1200);
}

onBeforeUnmount(stop);
</script>

<template>
  <div class="inline-generation-example">
    <mt-prompt-field
      label="Describe the product"
      placeholder="Describe the product in a few words, for example: warm, minimal, for living rooms"
      :status="status"
      :rows="{ min: 1, max: 4 }"
      @submit="generate"
      @stop="stop"
    />

    <mt-textarea v-model="description" label="Description" />
  </div>
</template>

<style scoped>
.inline-generation-example {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
