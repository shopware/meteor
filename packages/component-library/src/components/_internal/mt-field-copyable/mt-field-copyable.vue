<template>
  <mt-tooltip :content="hasCopied ? copiedText : idleText">
    <template #default="params">
      <button
        v-bind="params"
        type="button"
        class="mt-field-copyable"
        :aria-label="hasCopied ? copiedText : idleText"
        @click="onCopy"
      >
        <mt-icon
          :name="hasCopied ? 'regular-checkmark' : 'regular-copy'"
          size="var(--scale-size-18)"
          color="var(--color-icon-primary-default)"
        />
      </button>
    </template>
  </mt-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    copyableText?: string | null;
    /**
     * Accessible name and tooltip shown before copying. Defaults to a generic
     * "Copy to clipboard"; pass a value to describe what is being copied.
     */
    label?: string;
    /**
     * Accessible name and tooltip shown right after a successful copy.
     */
    copiedLabel?: string;
    /**
     * When set, a successful copy is confirmed: the icon swaps to a checkmark and the
     * tooltip and accessible name change to the copied wording. Resets shortly after.
     */
    copyableTooltip?: boolean;
  }>(),
  {
    copyableText: null,
    label: undefined,
    copiedLabel: undefined,
    copyableTooltip: false,
  },
);

// `legacy: true` keeps the detached-textarea fallback for insecure origins, where
// `navigator.clipboard` is undefined and the async Clipboard API is unavailable.
const { copy, copied } = useClipboard({ legacy: true });

const { t } = useI18n({
  messages: {
    en: {
      canCopy: "Copy to clipboard",
      wasCopied: "Copied to clipboard",
    },
    de: {
      canCopy: "In Zwischenablage kopieren",
      wasCopied: "In Zwischenablage kopiert",
    },
  },
});

const idleText = computed(() => props.label ?? t("canCopy"));
const copiedText = computed(() => props.copiedLabel ?? t("wasCopied"));

// Confirmation is opt-in, so a field that does not ask for it keeps a static copy icon.
const hasCopied = computed(() => props.copyableTooltip && copied.value);

function onCopy() {
  if (!props.copyableText) return;

  copy(props.copyableText);
}
</script>

<style scoped>
.mt-field-copyable {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  padding: var(--scale-size-8);
  border-radius: var(--border-radius-button);
  transition: background-color 0.15s ease-out;
  margin-inline-end: var(--scale-size-6);
  cursor: pointer;

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: var(--scale-size-2);
  }
}
</style>
