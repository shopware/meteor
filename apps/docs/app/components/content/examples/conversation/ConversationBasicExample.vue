<script setup lang="ts">
import { onBeforeUnmount, ref, useTemplateRef } from "vue";
import {
  MtConversation,
  MtMessage,
  MtPromptField,
  MtText,
  MtTextShimmer,
  type MtChatStatus,
  type MtPromptFieldMessage,
} from "@shopware-ag/meteor-component-library";

const messages = ref([
  { id: 1, from: "user" as const, text: "Which products are low on stock?" },
  {
    id: 2,
    from: "assistant" as const,
    text: "Three products have fewer than five items left: the desk lamp, the oak shelf and the linen cushion.",
  },
]);
const status = ref<MtChatStatus>("ready");
const conversation = useTemplateRef("conversation");

let request: ReturnType<typeof setTimeout> | undefined;

function stop() {
  clearTimeout(request);
  status.value = "ready";
}

function send({ text }: MtPromptFieldMessage) {
  messages.value.push({ id: Date.now(), from: "user", text });
  status.value = "submitted";
  conversation.value?.scrollToBottom();

  request = setTimeout(() => {
    messages.value.push({
      id: Date.now(),
      from: "assistant",
      text: "In a real application, this answer comes from the AI service.",
    });
    stop();
  }, 1500);
}

onBeforeUnmount(stop);
</script>

<template>
  <mt-conversation ref="conversation" class="conversation-example">
    <mt-message
      v-for="message in messages"
      :key="message.id"
      :from="message.from"
    >
      <mt-text size="xs">{{ message.text }}</mt-text>
    </mt-message>

    <template #status>
      <mt-text-shimmer v-if="status === 'submitted'" size="xs">
        Generating response…
      </mt-text-shimmer>
    </template>

    <template #footer>
      <mt-prompt-field
        placeholder="Ask anything…"
        :status="status"
        @submit="send"
        @stop="stop"
      />
    </template>
  </mt-conversation>
</template>

<style scoped>
.conversation-example {
  height: 28rem;
}
</style>
