<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { MtButton, MtIcon } from "@shopware-ag/meteor-component-library";
import { usePresence } from "../composables/usePresence";

export interface CommandPaletteItem {
  id: string;
  label: string;
  icon: string;
  run: () => void;
}

export interface CommandPaletteGroup {
  id: string;
  label: string;
  items: CommandPaletteItem[];
  /** Shown before anything is typed, such as the pages and the actions. */
  showWithoutQuery?: boolean;
}

/**
 * PROTOTYPE of a command palette for the actions of the app header: a search button that opens a
 * modal dialog, also with ⌘K or Ctrl+K from anywhere. Typing filters the groups; the arrow keys
 * move through the results while the focus stays in the field, and Enter runs the active one.
 * It opens with a short drop and fade, and closes faster than it opens.
 */
const props = defineProps<{
  groups: CommandPaletteGroup[];
}>();

const { t } = useI18n();
const listId = useId();

const dialog = useTemplateRef("dialog");
const input = useTemplateRef("input");
const isOpen = ref(false);
/** The results stay rendered while the dialog fades out. */
const { isRendered, onTransitionEnd } = usePresence(isOpen);
const query = ref("");
const activeIndex = ref(0);
let returnFocusTo: HTMLElement | null = null;

const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
const shortcut = isMac ? "⌘K" : "Ctrl+K";

const MAX_PER_GROUP = 5;

const results = computed(() => {
  const term = query.value.trim().toLowerCase();

  return props.groups
    .map((group) => ({
      ...group,
      items: term
        ? group.items
            .filter((item) => item.label.toLowerCase().includes(term))
            .slice(0, MAX_PER_GROUP)
        : group.showWithoutQuery
          ? group.items
          : [],
    }))
    .filter((group) => group.items.length > 0);
});

const flat = computed(() => results.value.flatMap((group) => group.items));
const activeItem = computed(() => flat.value[activeIndex.value]);

watch(query, () => (activeIndex.value = 0));

const optionId = (item: CommandPaletteItem) => `${listId}-${item.id}`;

/** The label in three parts, so the part that matches the query can be marked. */
function parts(label: string) {
  const term = query.value.trim();
  const start = term ? label.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (start === -1) return [label, "", ""];
  return [
    label.slice(0, start),
    label.slice(start, start + term.length),
    label.slice(start + term.length),
  ];
}

async function open() {
  if (isOpen.value) return;
  returnFocusTo = document.activeElement as HTMLElement | null;
  query.value = "";
  activeIndex.value = 0;
  isOpen.value = true;
  dialog.value?.showModal();
  await nextTick();
  input.value?.focus();
}

function close() {
  dialog.value?.close();
}

function onClose() {
  isOpen.value = false;
  returnFocusTo?.focus();
  returnFocusTo = null;
}

function run(item: CommandPaletteItem | undefined) {
  if (!item) return;
  close();
  item.run();
}

function move(step: number) {
  const count = flat.value.length;
  if (!count) return;
  activeIndex.value = (activeIndex.value + step + count) % count;
  document
    .getElementById(optionId(flat.value[activeIndex.value]))
    ?.scrollIntoView?.({ block: "nearest" });
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    move(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    move(-1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    run(activeItem.value);
  }
}

function closeOnBackdrop(event: MouseEvent) {
  // Clicks on the backdrop target the dialog itself, clicks inside it target its content.
  if (event.target === dialog.value) close();
}

function onShortcut(event: KeyboardEvent) {
  const modifier = isMac ? event.metaKey : event.ctrlKey;
  if (modifier && !event.altKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (isOpen.value) close();
    else void open();
  }
}

onMounted(() => window.addEventListener("keydown", onShortcut));
onBeforeUnmount(() => window.removeEventListener("keydown", onShortcut));

defineExpose({ open });
</script>

<template>
  <mt-button
    variant="tertiary"
    size="default"
    square
    :aria-label="t('palette.label')"
    :title="t('palette.shortcut', { shortcut })"
    :aria-keyshortcuts="isMac ? 'Meta+K' : 'Control+K'"
    aria-haspopup="dialog"
    @click="open"
  >
    <mt-icon name="regular-search" size="var(--scale-size-16)" decorative />
  </mt-button>

  <dialog
    ref="dialog"
    class="command-palette-prototype"
    :aria-label="t('palette.label')"
    @close="onClose"
    @transitionend="onTransitionEnd"
    @click="closeOnBackdrop"
  >
    <template v-if="isRendered">
      <div class="command-palette-prototype__search">
        <mt-icon
          name="regular-search"
          size="var(--scale-size-16)"
          color="var(--color-icon-secondary-default)"
          decorative
        />
        <input
          ref="input"
          v-model="query"
          class="command-palette-prototype__input"
          type="text"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          aria-autocomplete="list"
          :aria-expanded="flat.length > 0"
          :aria-controls="listId"
          :aria-activedescendant="activeItem ? optionId(activeItem) : undefined"
          :aria-label="t('palette.label')"
          :placeholder="t('palette.placeholder')"
          @keydown="onKeydown"
        />
      </div>

      <div
        :id="listId"
        role="listbox"
        :aria-label="t('palette.label')"
        class="command-palette-prototype__results"
      >
        <div
          v-for="group in results"
          :key="group.id"
          role="group"
          :aria-labelledby="`${listId}-${group.id}`"
          class="command-palette-prototype__group"
        >
          <div
            :id="`${listId}-${group.id}`"
            class="command-palette-prototype__heading"
            role="presentation"
          >
            {{ group.label }}
          </div>

          <div
            v-for="item in group.items"
            :id="optionId(item)"
            :key="item.id"
            role="option"
            class="command-palette-prototype__option"
            :aria-selected="item === activeItem"
            @pointermove="activeIndex = flat.indexOf(item)"
            @click="run(item)"
          >
            <mt-icon
              :name="item.icon"
              size="var(--scale-size-16)"
              color="var(--color-icon-secondary-default)"
              decorative
            />
            <span class="command-palette-prototype__label">
              {{ parts(item.label)[0] }}<mark>{{ parts(item.label)[1] }}</mark
              >{{ parts(item.label)[2] }}
            </span>
          </div>
        </div>

        <p v-if="!flat.length" class="command-palette-prototype__empty">
          {{ t("palette.empty", { query: query.trim() }) }}
        </p>
      </div>

      <div class="command-palette-prototype__footer" aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd>{{ t("palette.hints.move") }}</span>
        <span><kbd>↵</kbd>{{ t("palette.hints.open") }}</span>
        <span><kbd>Esc</kbd>{{ t("palette.hints.close") }}</span>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
.command-palette-prototype {
  position: fixed;
  inset-block-start: 12vh;
  width: min(40rem, calc(100vw - var(--scale-size-32)));
  max-height: min(32rem, 76vh);
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  color: var(--color-text-primary-default);
  background-color: var(--color-elevation-surface-default);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  box-shadow: 0 16px 48px -12px var(--color-elevation-shadow-default);
}

.command-palette-prototype[open] {
  display: flex;
  flex-direction: column;
}

/* Drops in slightly from above and fades, from its top edge. It leaves faster and with less
   travel; `display` and `overlay` keep the closing dialog in the top layer until it has faded. */
.command-palette-prototype {
  opacity: 0;
  transform: translateY(calc(-1 * var(--scale-size-4))) scale(0.98);
  transform-origin: top;
  transition:
    opacity 120ms ease-in,
    transform 120ms ease-in,
    overlay 120ms allow-discrete,
    display 120ms allow-discrete;
}

.command-palette-prototype[open] {
  opacity: 1;
  transform: none;
  transition-duration: 180ms;
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

@starting-style {
  .command-palette-prototype[open] {
    opacity: 0;
    transform: translateY(calc(-1 * var(--scale-size-8))) scale(0.98);
  }
}

.command-palette-prototype::backdrop {
  background-color: var(--color-elevation-backdrop-default);
  opacity: 0;
  transition:
    opacity 120ms ease-in,
    overlay 120ms allow-discrete,
    display 120ms allow-discrete;
}

.command-palette-prototype[open]::backdrop {
  opacity: 1;
  transition-duration: 180ms;
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

@starting-style {
  .command-palette-prototype[open]::backdrop {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .command-palette-prototype,
  .command-palette-prototype::backdrop {
    transition: none;
  }
}

.command-palette-prototype__search {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--scale-size-12);
  padding-inline: var(--scale-size-16);
  border-bottom: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.command-palette-prototype__input {
  flex: 1;
  min-width: 0;
  height: var(--scale-size-48);
  padding: 0;
  color: inherit;
  font-family: inherit;
  /* 16px, so Safari on iOS doesn't zoom in when the field gets focus. */
  font-size: var(--font-size-s);
  background: transparent;
  border: none;
  outline: none;
}

.command-palette-prototype__input::placeholder {
  color: var(--color-text-secondary-default);
}

.command-palette-prototype__results {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--scale-size-4);
}

.command-palette-prototype__heading {
  padding: var(--scale-size-8) var(--scale-size-12) var(--scale-size-4);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-line-height-2xs);
}

.command-palette-prototype__option {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-height: var(--scale-size-36);
  padding-inline: var(--scale-size-12);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.command-palette-prototype__option[aria-selected="true"] {
  background: var(--color-interaction-secondary-hover);
}

.command-palette-prototype__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.command-palette-prototype__label mark {
  color: inherit;
  font-weight: var(--font-weight-semibold);
  background: none;
}

.command-palette-prototype__empty {
  margin: 0;
  padding: var(--scale-size-24) var(--scale-size-12);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  text-align: center;
}

.command-palette-prototype__footer {
  display: flex;
  flex-shrink: 0;
  gap: var(--scale-size-16);
  padding: var(--scale-size-8) var(--scale-size-16);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  background: var(--color-background-secondary-default);
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.command-palette-prototype__footer span {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
}

.command-palette-prototype__footer kbd {
  min-width: var(--scale-size-20);
  padding-inline: var(--scale-size-4);
  font-family: inherit;
  font-size: var(--font-size-2xs);
  line-height: var(--scale-size-20);
  text-align: center;
  background: var(--color-elevation-surface-default);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
}

.command-palette-prototype__footer kbd + kbd {
  margin-inline-start: calc(-1 * var(--scale-size-2));
}
</style>
