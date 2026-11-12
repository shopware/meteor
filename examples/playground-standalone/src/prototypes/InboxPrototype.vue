<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import { I18nT, useI18n } from "vue-i18n";
import {
  MtButton,
  MtEmptyState,
  MtFloatingUi,
  MtIcon,
  MtText,
} from "@shopware-ag/meteor-component-library";
import { usePresence } from "../composables/usePresence";
import { useRelativeTime } from "../composables/useRelativeTime";
import type { Notification } from "../data/notifications";

/**
 * PROTOTYPE of an inbox for the actions of the app header: a bell with the number of unread
 * notifications, and a panel below it with the notifications, newest first. Notifications that
 * were shown count as read once the panel closes, like in Nexus.
 */
const notifications = defineModel<Notification[]>({ required: true });

const emit = defineEmits<{
  /** A notification's action, such as opening the automations that need attention. */
  open: [notification: Notification];
}>();

const { t } = useI18n();
const relativeTime = useRelativeTime();

const isOpen = ref(false);
const { isRendered, onTransitionEnd } = usePresence(isOpen);
const trigger = useTemplateRef<InstanceType<typeof MtButton>>("trigger");
const panel = useTemplateRef("panel");

/**
 * Opens below the bell, lined up with its end edge, but stays 8px inside the window: on a phone the
 * panel is wider than the room left of the bell. Floating UI's `shift` does this too, but the
 * playground doesn't depend on Floating UI itself.
 */
const floatingUiOptions = {
  placement: "bottom-end" as const,
  middleware: [
    {
      name: "keepInWindow",
      fn: ({
        x,
        rects,
      }: {
        x: number;
        rects: { floating: { width: number } };
      }) => ({
        x: Math.min(
          Math.max(x, 8),
          window.innerWidth - rects.floating.width - 8,
        ),
      }),
    },
  ],
};

const unread = computed(
  () => notifications.value.filter((item) => !item.read).length,
);

const icons: Record<Notification["type"], string> = {
  failed: "regular-times-circle",
  missingAccount: "regular-plug",
  memberJoined: "regular-user-plus",
  integrationAdded: "regular-checkmark",
};

function markAllRead() {
  notifications.value = notifications.value.map((item) => ({
    ...item,
    read: true,
  }));
}

function focusables() {
  return Array.from(panel.value?.querySelectorAll<HTMLElement>("button") ?? []);
}

async function open() {
  isOpen.value = true;
  await nextTick();
  focusables()[0]?.focus();
}

function close({ returnFocus = false } = {}) {
  if (!isOpen.value) return;
  isOpen.value = false;
  markAllRead();
  if (returnFocus) (trigger.value?.$el as HTMLElement | undefined)?.focus();
}

function toggle() {
  if (isOpen.value) close();
  else void open();
}

/** Arrow keys move through the buttons of the panel, Escape closes it. */
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    close({ returnFocus: true });
    return;
  }
  if (event.key === "Tab") {
    close();
    return;
  }
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

  event.preventDefault();
  const list = focusables();
  const index = list.indexOf(document.activeElement as HTMLElement);
  const step = event.key === "ArrowDown" ? 1 : -1;
  list[Math.min(Math.max(index + step, 0), list.length - 1)]?.focus();
}

function openNotification(notification: Notification) {
  close({ returnFocus: true });
  emit("open", notification);
}
</script>

<template>
  <mt-floating-ui
    :is-opened="isRendered"
    :floating-ui-options="floatingUiOptions"
    :offset="4"
    @close="close()"
  >
    <template #trigger>
      <mt-button
        ref="trigger"
        class="inbox-prototype__trigger"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('inbox.label', { count: unread }, unread)"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        @click="toggle"
      >
        <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
        <span v-if="unread" class="inbox-prototype__count" aria-hidden="true">
          {{ unread > 9 ? "9+" : unread }}
        </span>
      </mt-button>
    </template>

    <div
      ref="panel"
      role="dialog"
      :aria-label="t('inbox.title')"
      class="inbox-prototype__panel"
      :class="{ 'inbox-prototype__panel--open': isOpen }"
      :inert="!isOpen || undefined"
      @keydown="onKeydown"
      @transitionend="onTransitionEnd"
    >
      <div class="inbox-prototype__header">
        <mt-text as="h2" size="s" weight="semibold">
          {{ t("inbox.title") }}
        </mt-text>

        <mt-button
          v-if="unread"
          variant="tertiary"
          size="small"
          square
          :aria-label="t('inbox.markAllRead')"
          :title="t('inbox.markAllRead')"
          @click="markAllRead"
        >
          <mt-icon
            name="regular-checkmark"
            size="var(--scale-size-12)"
            decorative
          />
        </mt-button>
      </div>

      <ul v-if="notifications.length" class="inbox-prototype__list">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="inbox-prototype__item"
        >
          <span
            class="inbox-prototype__tile"
            :class="`inbox-prototype__tile--${notification.type}`"
          >
            <mt-icon
              :name="icons[notification.type]"
              size="var(--scale-size-12)"
              decorative
            />
          </span>

          <div class="inbox-prototype__body">
            <mt-text size="xs" class="inbox-prototype__text">
              <i18n-t
                :keypath="`inbox.types.${notification.type}`"
                scope="global"
              >
                <template #subject>
                  <strong>{{ notification.subject }}</strong>
                </template>
                <template #detail>
                  <strong>{{ notification.detail }}</strong>
                </template>
              </i18n-t>
            </mt-text>

            <mt-text size="2xs" color="color-text-secondary-default">
              {{ relativeTime(-notification.minutesAgo) }}
            </mt-text>

            <mt-button
              v-if="
                notification.type === 'failed' ||
                notification.type === 'missingAccount'
              "
              class="inbox-prototype__action"
              variant="secondary"
              size="small"
              @click="openNotification(notification)"
            >
              {{ t("inbox.open") }}
            </mt-button>
          </div>

          <span
            v-if="!notification.read"
            class="inbox-prototype__unread"
            aria-hidden="true"
          />
        </li>
      </ul>

      <mt-empty-state
        v-else
        class="inbox-prototype__empty"
        icon="regular-inbox"
        :headline="t('inbox.empty.headline')"
        :description="t('inbox.empty.description')"
        centered
      />
    </div>
  </mt-floating-ui>
</template>

<style scoped>
.inbox-prototype__trigger {
  position: relative;
}

/* The number of unread notifications, over the bell's top end corner. */
.inbox-prototype__count {
  position: absolute;
  inset-block-start: var(--scale-size-4);
  inset-inline-end: var(--scale-size-2);
  min-width: var(--scale-size-16);
  height: var(--scale-size-16);
  padding-inline: var(--scale-size-4);
  box-sizing: border-box;
  color: var(--color-static-white);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  line-height: var(--scale-size-16);
  text-align: center;
  background: var(--color-interaction-critical-default);
  border-radius: var(--border-radius-round);
  box-shadow: 0 0 0 var(--scale-size-2) var(--color-elevation-surface-default);
}

/* The surface and motion of the context switcher's panel, opening from the bell above its end. */
.inbox-prototype__panel {
  box-sizing: border-box;
  width: min(23rem, calc(100vw - var(--scale-size-32)));
  max-height: min(32rem, calc(100vh - var(--scale-size-80)));
  overflow-y: auto;
  background-color: var(--color-elevation-surface-default);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default);
  opacity: 0;
  transform: translateY(calc(-1 * var(--scale-size-4))) scale(0.97);
  transform-origin: top right;
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in;
}

.inbox-prototype__panel--open {
  opacity: 1;
  transform: none;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

@starting-style {
  .inbox-prototype__panel--open {
    opacity: 0;
    transform: translateY(calc(-1 * var(--scale-size-4))) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .inbox-prototype__panel {
    transition: none;
  }
}

.inbox-prototype__header {
  position: sticky;
  z-index: 1;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--scale-size-48);
  padding-inline: var(--scale-size-16) var(--scale-size-8);
  background-color: var(--color-elevation-surface-default);
  border-bottom: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.inbox-prototype__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.inbox-prototype__item {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-12);
  padding: var(--scale-size-12) var(--scale-size-16);
}

.inbox-prototype__item + .inbox-prototype__item {
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.inbox-prototype__tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  color: var(--color-icon-primary-default);
  background: var(--color-background-secondary-default);
  border-radius: 24%;
  box-shadow: inset 0 0 0 var(--scale-size-1)
    var(--color-border-secondary-default);
}

.inbox-prototype__tile--failed {
  color: var(--color-icon-critical-default);
  background: var(--color-background-critical-default);
  box-shadow: none;
}

.inbox-prototype__tile--missingAccount {
  color: var(--color-icon-attention-default);
  background: var(--color-background-attention-default);
  box-shadow: none;
}

.inbox-prototype__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--scale-size-2);
  min-width: 0;
}

.inbox-prototype__text strong {
  font-weight: var(--font-weight-semibold);
}

.inbox-prototype__action {
  margin-block-start: var(--scale-size-8);
}

.inbox-prototype__unread {
  flex-shrink: 0;
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  margin-block-start: var(--scale-size-6);
  background: var(--color-icon-brand-default);
  border-radius: var(--border-radius-round);
}

.inbox-prototype__empty {
  padding: var(--scale-size-32) var(--scale-size-16);
}
</style>
