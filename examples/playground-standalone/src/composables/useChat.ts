import { ref } from "vue";

export interface ChatMessage {
  id: number;
  author: "user" | "assistant";
  /** An i18n key for the placeholder messages, the typed text for the user's own. */
  text: string;
  translated?: boolean;
}

// One conversation for the whole app, so it continues between the sidebar and the Copilot page.
// Placeholder content: there is no assistant behind the chat.
const messages = ref<ChatMessage[]>([
  { id: 1, author: "user", text: "chat.messages.question", translated: true },
  {
    id: 2,
    author: "assistant",
    text: "chat.messages.answer",
    translated: true,
  },
]);
const draft = ref("");

/** Sends the draft and answers it with a placeholder reply. Returns whether there was a draft. */
function send() {
  const text = draft.value.trim();
  if (!text) return false;

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
  return true;
}

export function useChat() {
  return { messages, draft, send };
}
