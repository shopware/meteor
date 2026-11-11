<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useTemplateRef,
  watch,
  type FunctionalComponent,
  type Slot,
} from "vue";
import {
  MtBrand,
  MtButton,
  MtFloatingUi,
  MtIcon,
} from "@shopware-ag/meteor-component-library";

export type ContextSwitcherTeam = {
  id: string;
  name: string;
  /** A second line below the name in the brand, such as the plan. */
  description?: string;
  /** The mark on the team's logo. */
  icon: string;
  /**
   * The logo's color, as a Meteor palette token such as `--color-pumpkin-500`. Palette colors stay
   * the same in dark mode, so the white mark keeps its contrast.
   */
  color: string;
};

/**
 * PROTOTYPE of a context switcher that wraps the brand at the start of the app header: the brand
 * with the name of the current team, and a panel to switch to another one, create one or manage the
 * current one.
 */
const props = withDefaults(
  defineProps<{
    /** What the button does, such as "Switch team". Read before the current team. */
    label: string;
    teams: ContextSwitcherTeam[];
    /** Adds a button below the teams to create one. */
    createLabel?: string;
    /** Actions at the end, such as managing the current team. */
    actions?: { id: string; label: string; icon: string }[];
    /**
     * `horizontal` opens the panel as a floating menu, for the bar. `vertical` positions it below
     * the brand inside the drawer, where a floating menu can't open above the modal dialog.
     */
    orientation?: "horizontal" | "vertical";
  }>(),
  {
    createLabel: undefined,
    actions: () => [],
    orientation: "horizontal",
  },
);

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
  create: [];
  action: [actionId: string];
}>();

const isOpen = ref(false);
const trigger = useTemplateRef("trigger");
const panel = useTemplateRef("panel");
const panelId = useId();

const current = computed(() =>
  props.teams.find((team) => team.id === model.value),
);

/**
 * The panel's content is written once and placed in the floating menu or in place. DefinePanel
 * keeps its slot, ReusePanel renders it, and the slot keeps this component's scoped styles.
 */
let panelContent: Slot | undefined;
const DefinePanel: FunctionalComponent = (_, { slots }) => {
  panelContent = slots.default;
  return null;
};
const ReusePanel: FunctionalComponent = () => panelContent?.();

function items() {
  return Array.from(
    panel.value?.querySelectorAll<HTMLElement>("[data-switcher-item]") ?? [],
  );
}

/** Focus starts on the current team. */
async function open() {
  isOpen.value = true;
  await nextTick();
  (
    panel.value?.querySelector<HTMLElement>("[aria-current]") ?? items()[0]
  )?.focus();
}

function close({ returnFocus = false } = {}) {
  if (!isOpen.value) return;
  isOpen.value = false;
  if (returnFocus) trigger.value?.focus();
}

/** In the drawer there is no mt-floating-ui to close the panel on a click outside of it. */
const root = useTemplateRef("root");
function closeOnOutsideClick(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close();
}
watch(isOpen, (open) => {
  if (props.orientation !== "vertical") return;
  if (open) document.addEventListener("pointerdown", closeOnOutsideClick);
  else document.removeEventListener("pointerdown", closeOnOutsideClick);
});
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", closeOnOutsideClick),
);

function toggle() {
  if (isOpen.value) close();
  else void open();
}

/** Arrow keys, Home and End move through the panel, without wrapping around. */
function onKeydown(event: KeyboardEvent) {
  const list = items();
  const index = list.indexOf(document.activeElement as HTMLElement);
  const targets: Record<string, number> = {
    ArrowDown: Math.min(index + 1, list.length - 1),
    ArrowUp: Math.max(index - 1, 0),
    Home: 0,
    End: list.length - 1,
  };

  if (event.key === "Escape") {
    // Closes only the panel, not the drawer around it.
    event.preventDefault();
    event.stopPropagation();
    close({ returnFocus: true });
  } else if (event.key === "Tab" && props.orientation === "horizontal") {
    // Leaving the floating panel closes it, so it never stays open behind the focus.
    close();
  } else if (event.key in targets) {
    event.preventDefault();
    list[targets[event.key]]?.focus();
  }
}

function select(id: string) {
  model.value = id;
  close({ returnFocus: true });
}

function run(callback: () => void) {
  close({ returnFocus: true });
  callback();
}
</script>

<template>
  <DefinePanel>
    <div class="context-switcher-prototype__section">
      <button
        v-for="team in teams"
        :key="team.id"
        type="button"
        class="context-switcher-prototype__item"
        :aria-current="team.id === model || undefined"
        data-switcher-item
        @click="select(team.id)"
      >
        <span
          class="context-switcher-prototype__logo"
          :style="{ '--context-switcher-color': `var(${team.color})` }"
        >
          <mt-icon :name="team.icon" size="12" decorative />
        </span>

        <span class="context-switcher-prototype__name">{{ team.name }}</span>

        <mt-icon
          v-if="team.id === model"
          class="context-switcher-prototype__check"
          name="regular-checkmark-xs"
          size="10"
          decorative
        />
      </button>

      <mt-button
        v-if="createLabel"
        class="context-switcher-prototype__create"
        variant="secondary"
        size="small"
        block
        data-switcher-item
        @click="run(() => emit('create'))"
      >
        <template #iconFront>
          <mt-icon name="regular-plus" size="12" decorative />
        </template>
        {{ createLabel }}
      </mt-button>
    </div>

    <div v-if="actions.length" class="context-switcher-prototype__section">
      <button
        v-for="action in actions"
        :key="action.id"
        type="button"
        class="context-switcher-prototype__item"
        data-switcher-item
        @click="run(() => emit('action', action.id))"
      >
        <span class="context-switcher-prototype__action-icon">
          <mt-icon :name="action.icon" size="16" decorative />
        </span>
        <span class="context-switcher-prototype__name">{{ action.label }}</span>
      </button>
    </div>
  </DefinePanel>

  <div
    ref="root"
    class="context-switcher-prototype"
    :class="`context-switcher-prototype--${orientation}`"
  >
    <mt-floating-ui
      v-if="orientation === 'horizontal'"
      :is-opened="isOpen"
      :floating-ui-options="{ placement: 'bottom-start' }"
      :offset="4"
      @close="close()"
    >
      <template #trigger>
        <button
          ref="trigger"
          type="button"
          class="context-switcher-prototype__trigger"
          :class="{ 'context-switcher-prototype__trigger--open': isOpen }"
          aria-haspopup="dialog"
          :aria-expanded="isOpen"
          :aria-label="`${label}: ${current?.name ?? ''}`"
          @click="toggle"
          @keydown.down.prevent="open"
        >
          <mt-brand
            :title="current?.name ?? ''"
            :subtitle="current?.description"
          />
          <span class="context-switcher-prototype__chevrons" aria-hidden="true">
            <mt-icon name="solid-chevron-up" size="10" decorative />
            <mt-icon name="solid-chevron-down" size="10" decorative />
          </span>
        </button>
      </template>

      <div
        ref="panel"
        role="dialog"
        :aria-label="label"
        class="context-switcher-prototype__panel"
        @keydown="onKeydown"
      >
        <ReusePanel />
      </div>
    </mt-floating-ui>

    <template v-else>
      <button
        ref="trigger"
        type="button"
        class="context-switcher-prototype__trigger"
        :class="{ 'context-switcher-prototype__trigger--open': isOpen }"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        :aria-label="`${label}: ${current?.name ?? ''}`"
        @click="toggle"
      >
        <mt-brand
          :title="current?.name ?? ''"
          :subtitle="current?.description"
        />
        <span class="context-switcher-prototype__chevrons" aria-hidden="true">
          <mt-icon name="solid-chevron-up" size="10" decorative />
          <mt-icon name="solid-chevron-down" size="10" decorative />
        </span>
      </button>

      <div
        v-if="isOpen"
        :id="panelId"
        ref="panel"
        role="group"
        :aria-label="label"
        class="context-switcher-prototype__panel"
        @keydown="onKeydown"
      >
        <ReusePanel />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* mt-floating-ui wraps the trigger in inline blocks, which would keep the brand from truncating. */
.context-switcher-prototype,
.context-switcher-prototype :deep(.mt-floating-ui),
.context-switcher-prototype :deep(.mt-floating-ui__trigger) {
  display: flex;
  min-width: 0;
}

.context-switcher-prototype__trigger {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
  /* Long names truncate instead of pushing the navigation away. */
  max-width: var(--scale-size-256);
  padding: var(--scale-size-4) var(--scale-size-12) var(--scale-size-4)
    var(--scale-size-4);
  color: var(--color-text-primary-default);
  font-family: inherit;
  text-align: start;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-m);
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

@media (hover: hover) and (pointer: fine) {
  .context-switcher-prototype__trigger:hover {
    background: var(--color-interaction-secondary-hover);
  }
}

.context-switcher-prototype__trigger--open {
  background: var(--color-interaction-secondary-hover);
}

.context-switcher-prototype__trigger:active {
  background: var(--color-interaction-secondary-pressed);
}

.context-switcher-prototype__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

/* Tighter lines than mt-brand's, so the team and its plan read as one block. */
:deep(.mt-brand__title),
:deep(.mt-brand__subtitle) {
  line-height: 1.25;
}

:deep(.mt-brand__subtitle) {
  color: var(--color-text-secondary-default);
}

/* A team's logo: a white mark on its color, rounded like the brand logo. */
.context-switcher-prototype__logo {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  color: var(--color-static-white);
  background: var(--context-switcher-color);
  border-radius: 24%;
  box-shadow: inset 0 0 0 var(--scale-size-1) rgb(0 0 0 / 0.06);
}

/* An up and a down chevron: the button opens a list to choose from. They part a little on hover
   and while the panel is open. */
.context-switcher-prototype__chevrons {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* The chevrons fill only half of their square icon box. */
  gap: calc(-1 * var(--scale-size-2));
  margin-inline-start: var(--scale-size-12);
  color: var(--color-icon-secondary-default);
}

.context-switcher-prototype__chevrons > * {
  transition: transform 150ms ease-out;
}

.context-switcher-prototype__trigger--open
  .context-switcher-prototype__chevrons
  > :first-child {
  transform: translateY(calc(-1 * var(--scale-size-1)));
}

.context-switcher-prototype__trigger--open
  .context-switcher-prototype__chevrons
  > :last-child {
  transform: translateY(var(--scale-size-1));
}

@media (hover: hover) and (pointer: fine) {
  .context-switcher-prototype__trigger:hover
    .context-switcher-prototype__chevrons
    > :first-child {
    transform: translateY(calc(-1 * var(--scale-size-1)));
  }

  .context-switcher-prototype__trigger:hover
    .context-switcher-prototype__chevrons
    > :last-child {
    transform: translateY(var(--scale-size-1));
  }
}

/* The surface of mt-action-menu, so it reads as one family with the help and user menus. */
.context-switcher-prototype__panel {
  box-sizing: border-box;
  width: min(17rem, calc(100vw - var(--scale-size-32)));
  max-height: min(32rem, calc(100vh - var(--scale-size-80)));
  overflow-y: auto;
  padding: var(--scale-size-4);
  background-color: var(--color-elevation-surface-default);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default);
}

/* mt-floating-ui fades its content in with a vertical squash. A short drop reads calmer. */
.context-switcher-prototype__panel.popoverTransition-enter-active {
  transition:
    opacity 150ms ease-out,
    transform 150ms ease-out;
}

.context-switcher-prototype__panel.popoverTransition-enter-from {
  opacity: 0;
  transform: translateY(calc(-1 * var(--scale-size-4)));
}

@media (prefers-reduced-motion: reduce) {
  .context-switcher-prototype__trigger,
  .context-switcher-prototype__chevrons > *,
  .context-switcher-prototype__panel.popoverTransition-enter-active {
    transition: none;
  }
}

.context-switcher-prototype__section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-2);
  padding-block: var(--scale-size-4);
}

/* The panel's own padding is enough above the first row and below the last, like in
   mt-action-menu. */
.context-switcher-prototype__section:first-child {
  padding-block-start: 0;
}

.context-switcher-prototype__section:last-child {
  padding-block-end: 0;
}

.context-switcher-prototype__section + .context-switcher-prototype__section {
  margin-inline: calc(-1 * var(--scale-size-4));
  padding-inline: var(--scale-size-4);
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.context-switcher-prototype__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-10);
  width: 100%;
  min-height: var(--scale-size-36);
  padding-inline: var(--scale-size-6) var(--scale-size-8);
  color: var(--color-text-primary-default);
  font-family: inherit;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  text-align: start;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.context-switcher-prototype__item:focus {
  outline: none;
}

/* Hover and keyboard focus look the same, like the highlighted item of mt-action-menu. */
.context-switcher-prototype__item:focus-visible {
  background: var(--color-interaction-secondary-hover);
}

@media (hover: hover) and (pointer: fine) {
  .context-switcher-prototype__item:hover {
    background: var(--color-interaction-secondary-hover);
  }
}

.context-switcher-prototype__item:active {
  background: var(--color-interaction-secondary-pressed);
}

.context-switcher-prototype__item[aria-current] {
  font-weight: var(--font-weight-semibold);
}

.context-switcher-prototype__name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.context-switcher-prototype__check {
  flex-shrink: 0;
  color: var(--color-icon-brand-default);
}

.context-switcher-prototype__create {
  margin-block: var(--scale-size-6) var(--scale-size-4);
}

/* Same footprint as a team logo, so the labels line up with the names. */
.context-switcher-prototype__action-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  color: var(--color-icon-primary-default);
}

/* In the drawer the brand fills the row, with the chevrons at its end, and the panel opens over
   the navigation below it. */
.context-switcher-prototype--vertical {
  position: relative;
  flex: 1;
  flex-direction: column;
}

.context-switcher-prototype--vertical .context-switcher-prototype__trigger {
  max-width: none;
}

.context-switcher-prototype--vertical .context-switcher-prototype__chevrons {
  margin-inline-start: auto;
}

.context-switcher-prototype--vertical .context-switcher-prototype__panel {
  position: absolute;
  z-index: 1;
  inset-block-start: calc(100% + var(--scale-size-8));
  inset-inline: 0;
  width: auto;
  max-height: calc(100vh - var(--scale-size-128));
  animation: context-switcher-prototype-drop 150ms ease-out;
}

@keyframes context-switcher-prototype-drop {
  from {
    opacity: 0;
    transform: translateY(calc(-1 * var(--scale-size-4)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .context-switcher-prototype--vertical .context-switcher-prototype__panel {
    animation: none;
  }
}
</style>
