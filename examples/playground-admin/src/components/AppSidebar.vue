<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

// Example content: a conversation with an assistant.
const messages = [
  { id: "sales", author: "user" },
  { id: "salesAnswer", author: "assistant" },
  { id: "stock", author: "user" },
  { id: "stockAnswer", author: "assistant" },
  { id: "description", author: "user" },
  { id: "descriptionAnswer", author: "assistant" },
  { id: "shorter", author: "user" },
  { id: "shorterAnswer", author: "assistant" },
] as const;
</script>

<template>
  <aside class="app-sidebar" :aria-label="t('sidebar.label')">
    <ol class="app-sidebar__messages">
      <li
        v-for="message in messages"
        :key="message.id"
        class="app-sidebar__message"
        :class="`app-sidebar__message--${message.author}`"
      >
        <span class="visually-hidden">{{
          t(`sidebar.${message.author}`)
        }}</span>
        <mt-text size="xs">{{ t(`sidebar.messages.${message.id}`) }}</mt-text>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.app-sidebar {
  padding: var(--scale-size-16);
}

.app-sidebar__messages {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-sidebar__message--user {
  align-self: flex-end;
  max-width: 85%;
  padding: var(--scale-size-8) var(--scale-size-12);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-l);
}
</style>
