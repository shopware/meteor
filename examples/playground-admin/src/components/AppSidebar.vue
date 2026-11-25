<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtTextarea,
  useApp,
} from "@shopware-ag/meteor-component-library";
import { useLayoutSettings } from "../composables/useLayoutSettings";

interface Message {
  id: number;
  author: "user" | "assistant";
  /** An i18n key below `sidebar.messages` for the example messages, the typed text otherwise. */
  text: string;
  translated: boolean;
}

const { t } = useI18n();
const app = useApp();
const layout = useLayoutSettings();

// The Administration has no sidebar open by default, so it starts closed when it can be reopened.
onMounted(() => {
  if (layout.sidebarClosable && !app.isMobile.value) app.close("sidebar");
});

// Example content: a conversation with the assistant. There is no assistant behind the chat.
const messages = ref<Message[]>([
  { id: 1, author: "user", text: "sales", translated: true },
  { id: 2, author: "assistant", text: "salesAnswer", translated: true },
]);

const draft = ref("");
const list = useTemplateRef<HTMLOListElement>("list");

function text(message: Message) {
  return message.translated
    ? t(`sidebar.messages.${message.text}`)
    : message.text;
}

async function send() {
  const value = draft.value.trim();
  if (!value) return;

  messages.value.push(
    { id: messages.value.length + 1, author: "user", text: value, translated: false },
    {
      id: messages.value.length + 2,
      author: "assistant",
      text: "placeholder",
      translated: true,
    },
  );
  draft.value = "";

  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight });
}
</script>

<template>
  <aside class="app-chat" :aria-label="t('sidebar.label')">
    <ol ref="list" class="app-chat__messages" role="log">
      <li
        v-for="message in messages"
        :key="message.id"
        class="app-chat__message"
        :class="`app-chat__message--${message.author}`"
      >
        <span class="visually-hidden">{{ t(`sidebar.${message.author}`) }}</span>
        <p class="app-chat__text">{{ text(message) }}</p>
      </li>
    </ol>

    <form class="app-chat__composer" @submit.prevent="send">
      <mt-textarea
        v-model="draft"
        :label="t('sidebar.message')"
        :placeholder="t('sidebar.placeholder')"
        @keydown.enter.exact.prevent="send"
      />
      <mt-button type="submit" variant="primary" size="small">
        {{ t("sidebar.send") }}
      </mt-button>
    </form>
  </aside>
</template>

<style scoped>
.app-chat {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
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

/* Both sides as bubbles: the user's in the brand color at the end, the assistant's grey at the start. */
.app-chat__message {
  max-width: 85%;
  padding: var(--scale-size-12) var(--scale-size-12);
  border-radius: var(--border-radius-l);
}

.app-chat__message--user {
  align-self: flex-end;
  background-color: var(--color-interaction-primary-default);
}

.app-chat__message--user .app-chat__text {
  /* White on the brand color, in the light and the dark theme, like a primary button. */
  color: var(--color-static-white);
}

.app-chat__message--assistant {
  align-self: flex-start;
  background-color: var(--color-background-secondary-default);
}

.app-chat__text {
  margin: 0;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
  white-space: pre-wrap;
}

.app-chat__composer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
}

.app-chat__composer > :first-child {
  align-self: stretch;
}

.app-chat__composer :deep(.mt-field) {
  margin-block-end: 0;
}
</style>
