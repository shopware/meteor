<script setup lang="ts">
import { ref } from "vue";
import {
  MtMarkdown,
  MtMessage,
  MtMessageAction,
  MtMessageActions,
} from "@shopware-ag/meteor-component-library";

const answer = "The **Halo pendant light** is the most expensive product, at €149.";
const feedback = ref<"good" | "bad">();

function rate(value: "good" | "bad") {
  feedback.value = feedback.value === value ? undefined : value;
}
</script>

<template>
  <mt-message from="assistant">
    <mt-markdown :content="answer" />
    <mt-message-actions>
      <mt-message-action label="Copy" icon="regular-copy" />
      <mt-message-action label="Retry" icon="regular-redo" />
      <mt-message-action
        label="Good answer"
        icon="regular-thumbs-up"
        :aria-pressed="feedback === 'good'"
        @click="rate('good')"
      />
      <mt-message-action
        label="Bad answer"
        icon="regular-thumbs-down"
        :aria-pressed="feedback === 'bad'"
        @click="rate('bad')"
      />
    </mt-message-actions>
  </mt-message>
</template>
