<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtText,
  MtTextarea,
} from "@shopware-ag/meteor-component-library";

interface Message {
  id: number;
  author: "user" | "assistant";
  /** An i18n key for the placeholder messages, the typed text for the user's own. */
  text: string;
  translated?: boolean;
}

const { t } = useI18n();

// Placeholder content: there is no assistant behind the chat.
const messages = ref<Message[]>([
  { id: 1, author: "user", text: "chat.messages.question", translated: true },
  {
    id: 2,
    author: "assistant",
    text: "chat.messages.answer",
    translated: true,
  },
]);
const draft = ref("");
const list = useTemplateRef("list");

async function send() {
  const text = draft.value.trim();
  if (!text) return;

  messages.value.push(
    { id: messages.value.length + 1, author: "user", text },
    {
      id: messages.value.length + 2,
      author: "assistant",
      text: "chat.messages.placeholder",
      translated: true,
    },
  );
  draft.value = "";

  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight });
}
</script>

<template>
  <aside class="app-chat" :aria-label="t('copilot.title')">
    <ol ref="list" class="app-chat__messages" role="log">
      <li
        v-for="message in messages"
        :key="message.id"
        class="app-chat__message"
        :class="`app-chat__message--${message.author}`"
      >
        <span class="visually-hidden">{{ t(`chat.${message.author}`) }}</span>
        <mt-text size="xs">
          {{ message.translated ? t(message.text) : message.text }}
        </mt-text>
      </li>
    </ol>

    <form class="app-chat__composer" @submit.prevent="send">
      <mt-textarea
        v-model="draft"
        :label="t('chat.message')"
        :placeholder="t('chat.placeholder')"
        @keydown.enter.exact.prevent="send"
      />
      <mt-button type="submit" variant="primary" size="small">
        {{ t("chat.send") }}
      </mt-button>
    </form>
  </aside>
</template>

<style scoped>
.app-chat {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.app-chat__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--scale-size-16);
  margin: 0;
  padding: var(--scale-size-16);
  overflow-y: auto;
  list-style: none;
}

.app-chat__message--user {
  align-self: flex-end;
  max-width: 85%;
  padding: var(--scale-size-8) var(--scale-size-12);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-l);
}

.app-chat__composer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
  border-block-start: var(--scale-size-1) solid
    var(--color-border-primary-default);
}

.app-chat__composer > :first-child {
  align-self: stretch;
}
</style>
