<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { MtButton, MtMarkdown } from "@shopware-ag/meteor-component-library";

const answer = `Two products need attention:

- **Desk lamp, brass** has a stock of *2*.
- **Linen cushion** is sold out.

| Product | Stock |
| :-- | --: |
| Desk lamp, brass | 2 |
| Linen cushion | 0 |

\`\`\`json
{ "productNumber": "SW-1012", "stock": 40 }
\`\`\``;

const content = ref("");
const streaming = ref(false);

let timer: ReturnType<typeof setInterval> | undefined;

function stop() {
  clearInterval(timer);
  streaming.value = false;
}

// Adds a few characters at a time, as a model's answer arrives.
function play() {
  stop();
  content.value = "";
  streaming.value = true;

  timer = setInterval(() => {
    content.value = answer.slice(0, content.value.length + 4);
    if (content.value.length === answer.length) stop();
  }, 40);
}

onMounted(play);
onBeforeUnmount(stop);
</script>

<template>
  <div class="markdown-streaming-example">
    <mt-markdown :content="content" :streaming="streaming" />
    <mt-button variant="secondary" :disabled="streaming" @click="play">Replay</mt-button>
  </div>
</template>

<style scoped>
.markdown-streaming-example {
  display: grid;
  gap: var(--scale-size-16);
  justify-items: start;
  min-height: 22rem;
}
</style>
