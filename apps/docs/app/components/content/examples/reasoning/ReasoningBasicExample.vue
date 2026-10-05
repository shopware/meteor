<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  MtButton,
  MtReasoning,
  MtReasoningContent,
  MtReasoningTrigger,
} from "@shopware-ag/meteor-component-library";

const reasoning =
  "The merchant wants the **five most expensive** products. I can search the catalog sorted by price, descending, limited to five, and list them with their stock.";

const content = ref("");
const streaming = ref(false);
// Every replay is a new answer, with its own reasoning block.
const run = ref(0);

let timer: ReturnType<typeof setInterval> | undefined;

function stop() {
  clearInterval(timer);
  streaming.value = false;
}

// Adds a few characters at a time, as a model's reasoning arrives.
function play() {
  stop();
  content.value = "";
  run.value += 1;
  streaming.value = true;

  timer = setInterval(() => {
    content.value = reasoning.slice(0, content.value.length + 3);
    if (content.value.length === reasoning.length) stop();
  }, 40);
}

onMounted(play);
onBeforeUnmount(stop);
</script>

<template>
  <div class="reasoning-example">
    <mt-reasoning :key="run" :streaming="streaming">
      <mt-reasoning-trigger />
      <mt-reasoning-content :content="content" />
    </mt-reasoning>
    <mt-button variant="secondary" :disabled="streaming" @click="play">Replay</mt-button>
  </div>
</template>

<style scoped>
.reasoning-example {
  display: grid;
  gap: var(--scale-size-16);
  justify-items: start;
  min-height: 9rem;
}
</style>
