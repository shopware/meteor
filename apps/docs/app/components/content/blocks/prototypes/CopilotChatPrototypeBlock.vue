<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import {
  MtApp,
  MtAvatar,
  MtBrand,
  MtButton,
  MtCard,
  MtContentHeader,
  MtIcon,
  MtNav,
  MtPage,
  MtPanel,
  MtSearch,
  MtSkeletonBar,
  MtText,
  MtTextarea,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

interface Message {
  author: "user" | "copilot";
  text: string;
}

interface Conversation {
  id: string;
  title: string;
  day: "Today" | "Earlier";
  messages: Message[];
}

// Sample data. Replace it with the conversations of the signed-in user.
const conversations = ref<Conversation[]>([
  {
    id: "1",
    title: "Best sellers this month",
    day: "Today",
    messages: [
      { author: "user", text: "Which products sold best this month?" },
      {
        author: "copilot",
        text: "Your best seller is the Running shoe Aero with 214 orders, followed by the Trail jacket Nordwand with 131 and the Merino base layer with 98. Together they make up 41 percent of the revenue this month.",
      },
    ],
  },
  { id: "2", title: "Product description for the new jacket", day: "Today", messages: [] },
  { id: "3", title: "Why did returns go up?", day: "Earlier", messages: [] },
  { id: "4", title: "Newsletter for the spring sale", day: "Earlier", messages: [] },
]);

const term = ref("");
const selectedId = ref("1");
const conversation = computed(() => conversations.value.find(({ id }) => id === selectedId.value)!);

const list = computed<NavSection[]>(() =>
  (["Today", "Earlier"] as const)
    .map((day) => ({
      header: day,
      items: conversations.value
        .filter((item) => item.day === day)
        .filter((item) => item.title.toLowerCase().includes(term.value.trim().toLowerCase()))
        .map((item) => ({ id: item.id, label: item.title, to: `/copilot/${item.id}` })),
    }))
    .filter((section) => section.items.length > 0),
);

// With Vue Router, each conversation is a route: compare the item with the current route instead.
const isActive = (item: NavItem) => item.id === selectedId.value;

function select(item: NavItem) {
  if (item.id) selectedId.value = item.id;
}

function startConversation() {
  const id = String(Date.now());
  conversations.value.unshift({ id, title: "New conversation", day: "Today", messages: [] });
  selectedId.value = id;
}

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Copilot", to: "/copilot", icon: "shopware-copilot" },
  { label: conversation.value.title },
]);

const suggestions = [
  "Summarize the orders of today",
  "Write a description for a product",
  "Which customers ordered most this year?",
];

const prompt = ref("");
const isAnswering = ref(false);
const thread = useTemplateRef("thread");

// Replace the timeout with the request to your assistant.
async function ask(text = prompt.value) {
  const question = text.trim();
  if (!question || isAnswering.value) return;

  conversation.value.messages.push({ author: "user", text: question });
  if (conversation.value.title === "New conversation") conversation.value.title = question;
  prompt.value = "";
  isAnswering.value = true;
  await nextTick();
  thread.value?.scrollIntoView({ block: "end" });

  setTimeout(() => {
    conversation.value.messages.push({
      author: "copilot",
      text: "This is a sample answer. Connect the block to your assistant to answer the question.",
    });
    isAnswering.value = false;
  }, 1200);
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="m" :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="secondary" size="default" @click="startConversation">
          <template #iconFront>
            <mt-icon name="regular-plus-xs" size="var(--scale-size-12)" decorative />
          </template>
          New conversation
        </mt-button>
      </template>

      <template #start>
        <mt-panel label="Conversations" icon="regular-comments" resizable>
          <aside class="list" aria-label="Conversations">
            <mt-search v-model="term" size="small" placeholder="Search conversations" />
            <mt-nav :sections="list" label="Conversations" :is-active="isActive" @navigate="select" />
          </aside>
        </mt-panel>
      </template>

      <div ref="thread" class="stack">
        <mt-content-header :title="conversation.title" />

        <div v-if="conversation.messages.length === 0" class="welcome">
          <mt-brand title="Copilot" subtitle="Ask anything about your shop" variant="copilot" />
          <div class="suggestions">
            <mt-button
              v-for="suggestion in suggestions"
              :key="suggestion"
              variant="secondary"
              size="small"
              @click="ask(suggestion)"
            >
              {{ suggestion }}
            </mt-button>
          </div>
        </div>

        <missing-feature v-else title="Chat message">
          No component for the messages of a conversation, with the question on one side and the
          answer on the other, and actions such as copying an answer. The bubbles stand in for it.

          <template #stand-in>
            <ol class="messages" aria-live="polite">
              <li
                v-for="(message, index) in conversation.messages"
                :key="index"
                class="message"
                :class="`message--${message.author}`"
              >
                <mt-avatar
                  v-if="message.author === 'user'"
                  first-name="Max"
                  last-name="Mustermann"
                  size="xs"
                />
                <mt-brand v-else title="Copilot" variant="copilot" compact />
                <mt-text size="s" as="p" class="message__text">{{ message.text }}</mt-text>
              </li>
            </ol>
          </template>
        </missing-feature>

        <missing-feature v-if="isAnswering" title="Answer in progress">
          No state for an answer that streams in word by word, with a button to stop it. A skeleton
          stands in for it.

          <template #stand-in>
            <mt-skeleton-bar />
          </template>
        </missing-feature>

        <mt-card>
          <form class="stack" @submit.prevent="ask()">
            <mt-textarea
              v-model="prompt"
              label="Message"
              placeholder="Ask Copilot about your shop"
              @keydown.enter.exact.prevent="ask()"
            />
            <div class="composer">
              <missing-feature title="Prompt input" inline>
                Textarea does not grow with the text and has no place for attachments or a stop
                button.
              </missing-feature>
              <mt-button
                variant="primary"
                size="default"
                type="submit"
                :disabled="!prompt.trim() || isAnswering"
              >
                <template #iconFront>
                  <mt-icon name="regular-paper-plane" size="var(--scale-size-16)" decorative />
                </template>
                Send
              </mt-button>
            </div>
          </form>
        </mt-card>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-12);
  align-content: start;
  padding: var(--scale-size-8);
}

.welcome {
  display: grid;
  justify-items: center;
  gap: var(--scale-size-16);
  padding-block: var(--scale-size-32);
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--scale-size-8);
}

.messages {
  display: grid;
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-8);
}

.message--user {
  flex-direction: row-reverse;
}

.message__text {
  max-width: 80%;
  margin: 0;
  padding: var(--scale-size-8) var(--scale-size-12);
  border-radius: var(--border-radius-l);
}

.message--user .message__text {
  background-color: var(--color-background-secondary-default);
}

.composer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
}
</style>
