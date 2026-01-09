<template>
  <component
    :is="isSubTrigger ? DropdownMenuSubTrigger : DropdownMenuItem"
    :as="link ? 'a' : as"
    :href="link"
    :target="link ? '_blank' : undefined"
    :rel="link ? 'noopener noreferrer' : undefined"
    :class="['mt-action-menu-item', `mt-action-menu-item--variant-${variant}`]"
    :disabled="disabled"
    :data-has-icon="!!icon || undefined"
    :aria-keyshortcuts="ariaKeyShortcuts"
  >
    <mt-icon v-if="!!icon" :name="icon" size="14" mode="solid" />

    <slot name="default" />

    <kbd
      v-if="shortcutKeys.length && !isSubTrigger && !link"
      aria-hidden="true"
      :class="[
        'mt-action-menu-item__shortcut',
        { 'mt-action-menu-item__shortcut--disabled': disabled },
      ]"
    >
      <span v-for="(key, index) in shortcutKeys" :key="index">{{ key }}</span>
    </kbd>

    <div v-if="isSubTrigger && !link" class="mt-action-menu-item__arrow">
      <mt-icon
        name="chevron-right-s"
        size="10"
        color="var(--color-icon-primary-default)"
        mode="regular"
      />
    </div>

    <div v-if="link" class="mt-action-menu-item__external-link">
      <mt-icon
        name="external-link-s"
        size="10"
        color="var(--color-icon-secondary-default)"
        mode="regular"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSubTrigger } from "reka-ui";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { computed, inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";

type ModifierKey = "mod" | "ctrl" | "alt" | "shift" | "meta";
type SpecialKey =
  | "enter"
  | "esc"
  | "tab"
  | "space"
  | "backspace"
  | "delete"
  | "up"
  | "down"
  | "left"
  | "right";

interface ShortcutDefinition {
  modifiers?: ModifierKey[];
  key: string | SpecialKey;
}

const MAC_SYMBOLS: Partial<Record<ModifierKey | SpecialKey, string>> = {
  mod: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  meta: "⌘",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

const SPECIAL_KEYS: SpecialKey[] = [
  "enter",
  "esc",
  "tab",
  "space",
  "backspace",
  "delete",
  "up",
  "down",
  "left",
  "right",
];

const MODIFIER_PRIORITY: Record<ModifierKey, number> = {
  mod: 1,
  ctrl: 1,
  meta: 1,
  alt: 2,
  shift: 3,
};

// ARIA key names per https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts
const ARIA_MODIFIER_KEYS: Record<ModifierKey, { mac: string; pc: string }> = {
  mod: { mac: "Meta", pc: "Control" },
  ctrl: { mac: "Control", pc: "Control" },
  alt: { mac: "Alt", pc: "Alt" },
  shift: { mac: "Shift", pc: "Shift" },
  meta: { mac: "Meta", pc: "Meta" },
};

const ARIA_SPECIAL_KEYS: Record<SpecialKey, string> = {
  enter: "Enter",
  esc: "Escape",
  tab: "Tab",
  space: "Space",
  backspace: "Backspace",
  delete: "Delete",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-action-menu-item": {
        keys: {
          shift: "Shift",
          ctrl: "Ctrl",
          alt: "Alt",
          meta: "Win",
          enter: "Enter",
          esc: "Esc",
          tab: "Tab",
          space: "Space",
          backspace: "Backspace",
          delete: "Delete",
        },
      },
    },
    de: {
      "mt-action-menu-item": {
        keys: {
          shift: "Umschalt",
          ctrl: "Strg",
          alt: "Alt",
          meta: "Win",
          enter: "Eingabe",
          esc: "Esc",
          tab: "Tab",
          space: "Leertaste",
          backspace: "Rücktaste",
          delete: "Entf",
        },
      },
    },
  },
});

const props = withDefaults(
  defineProps<{
    variant?: "default" | "critical";
    icon?: string;
    disabled?: boolean;
    shortcut?: ShortcutDefinition;
    isSubTrigger?: boolean;
    as?: string;
    link?: string;
  }>(),
  {
    variant: "default",
    icon: undefined,
    disabled: false,
    shortcut: undefined,
    as: undefined,
    link: undefined,
  },
);

const group = inject<{ registerItem: (hasIcon: boolean) => void } | null>(
  "mt-action-menu-group",
  null,
);

onMounted(() => {
  if (group) {
    group.registerItem(!!props.icon);
  }
});

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const getKeyLabel = (key: ModifierKey | SpecialKey, forMac: boolean): string => {
  if (forMac && MAC_SYMBOLS[key]) return MAC_SYMBOLS[key]!;
  if (["up", "down", "left", "right"].includes(key)) return MAC_SYMBOLS[key]!;
  if (key === "mod") return t("mt-action-menu-item.keys.ctrl");
  return t(`mt-action-menu-item.keys.${key}`);
};

const formatShortcut = (def: ShortcutDefinition): { pc: string[]; mac: string[] } => {
  const { modifiers = [], key } = def;
  const sortedModifiers = [...modifiers].sort(
    (a, b) => MODIFIER_PRIORITY[a] - MODIFIER_PRIORITY[b],
  );
  const isSpecial = SPECIAL_KEYS.includes(key as SpecialKey);

  return {
    pc: [
      ...sortedModifiers.map((m) => getKeyLabel(m, false)),
      isSpecial ? getKeyLabel(key as SpecialKey, false) : key.toUpperCase(),
    ],
    mac: [
      ...sortedModifiers.map((m) => getKeyLabel(m, true)),
      isSpecial ? getKeyLabel(key as SpecialKey, true) : key.toUpperCase(),
    ],
  };
};

const shortcutKeys = computed(() => {
  if (!props.shortcut) return [];
  const formatted = formatShortcut(props.shortcut);
  return isMac ? formatted.mac : formatted.pc;
});

const ariaKeyShortcuts = computed(() => {
  if (!props.shortcut) return undefined;
  const { modifiers = [], key } = props.shortcut;
  const sortedModifiers = [...modifiers].sort(
    (a, b) => MODIFIER_PRIORITY[a] - MODIFIER_PRIORITY[b],
  );
  const platform = isMac ? "mac" : "pc";

  const parts = sortedModifiers.map((m) => ARIA_MODIFIER_KEYS[m][platform]);
  const isSpecial = SPECIAL_KEYS.includes(key as SpecialKey);
  parts.push(isSpecial ? ARIA_SPECIAL_KEYS[key as SpecialKey] : key.toUpperCase());

  return parts.join("+");
});
</script>

<style scoped>
.mt-action-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--scale-size-8);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-regular);
  min-height: var(--scale-size-32);
  padding-inline: var(--scale-size-10);
  border-radius: var(--border-radius-s);
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  &[data-highlighted] {
    background-color: var(--color-interaction-secondary-hover);
    outline: none;
  }
}

.mt-action-menu-item--variant-default {
  color: var(--color-text-primary-default);

  &[data-disabled] {
    color: var(--color-text-primary-disabled);
    cursor: not-allowed;
  }
}

.mt-action-menu-item--variant-critical {
  color: var(--color-text-critical-default);

  &[data-disabled] {
    color: var(--color-text-critical-disabled);
    cursor: not-allowed;
  }
}

.mt-action-menu-item__shortcut {
  display: flex;
  gap: 0.5ch;
  margin-left: auto;
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-regular);
  user-select: none;
  padding-left: var(--scale-size-24);
}

.mt-action-menu-item__shortcut--disabled {
  color: var(--color-text-secondary-disabled);
}

.mt-action-menu-item__arrow {
  margin-left: auto;
  padding-left: var(--scale-size-24);
  display: grid;
  place-items: center;
}

.mt-action-menu-item__external-link {
  margin-left: auto;
  padding-left: var(--scale-size-24);
  display: grid;
  place-items: center;
}
</style>
