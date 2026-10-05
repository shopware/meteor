<template>
  <div class="mt-message" :class="`mt-message--${from}`">
    <span class="mt-message__sender">{{ sender ?? t(from) }}</span>

    <div v-if="hasSlotContent(slots.attachments)" class="mt-message__attachments">
      <slot name="attachments" />
    </div>

    <div v-if="hasSlotContent(slots.default)" class="mt-message__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { hasSlotContent } from "@/utils/slot";

/**
 * One message of an AI conversation. Messages of the user are shown as a bubble at the end,
 * messages of the assistant use the full width.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /**
     * Who wrote the message, the `role` of an AI SDK message. System messages use the full width,
     * like the assistant's.
     */
    from: "user" | "assistant" | "system";
    /** The sender for assistive technology. Defaults to a translated "You", "Assistant" or "System". */
    sender?: string;
  }>(),
  {
    sender: undefined,
  },
);

const slots = defineSlots<{
  /** The content, for example the text, a chain of thought or a result. */
  default?(): unknown;
  /** Attachments of the message, shown above the content, for example `mt-attachment`. */
  attachments?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { user: "You", assistant: "Assistant", system: "System" },
    de: { user: "Du", assistant: "Assistent", system: "System" },
  },
});
</script>

<style>
.mt-message {
  position: relative;
  display: grid;
  gap: var(--scale-size-8);
  min-width: 0;
  animation: mt-message-enter 0.2s ease-out;
}

.mt-message--user {
  justify-items: end;
  width: fit-content;
  max-width: 85%;
  margin-inline-start: auto;
}

.mt-message__sender {
  position: absolute;
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.mt-message__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-4);
}

.mt-message--user .mt-message__attachments {
  justify-content: flex-end;
}

.mt-message__content {
  display: grid;
  gap: var(--scale-size-16);
  min-width: 0;
  overflow-wrap: anywhere;
}

.mt-message--user .mt-message__content {
  padding: var(--scale-size-8) var(--scale-size-12);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-m);
}

@keyframes mt-message-enter {
  from {
    opacity: 0;
    transform: translateY(var(--scale-size-4));
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-message {
    animation: none;
  }
}
</style>
