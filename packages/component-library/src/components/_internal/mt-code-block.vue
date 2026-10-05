<template>
  <div class="mt-code-block mt-not-prose">
    <pre><code :class="language ? `language-${language}` : undefined">{{ code }}</code></pre>

    <div v-if="!incomplete" class="mt-code-block__copy">
      <mt-tooltip :content="copied ? t('copied') : t('copy')">
        <template #default="tooltip">
          <mt-button
            v-bind="tooltip"
            variant="secondary"
            size="x-small"
            square
            :aria-label="copied ? t('copied') : t('copy')"
            @click="copy(code)"
          >
            <template #iconFront>
              <mt-icon
                :name="copied ? 'regular-checkmark-s' : 'regular-copy-s'"
                size="12"
                decorative
              />
            </template>
          </mt-button>
        </template>
      </mt-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";

/** A block of code with a button that copies it, for `mt-markdown` and `mt-tool`. */
defineProps<{
  code: string;
  language?: string;
  /** Whether the block is still being written, so there is nothing complete to copy yet. */
  incomplete?: boolean;
}>();

const { t } = useI18n({
  messages: {
    en: { copy: "Copy code", copied: "Copied" },
    de: { copy: "Code kopieren", copied: "Kopiert" },
  },
});

const { copy, copied } = useClipboard();
</script>

<style>
/* Styled on its own, so code looks the same inside and outside of `mt-prose`. */
.mt-code-block {
  position: relative;
}

.mt-code-block pre {
  margin: 0;
  padding: var(--scale-size-12) var(--scale-size-16);
  border-radius: var(--border-radius-s);
  background-color: var(--color-background-tertiary-default);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  white-space: pre;
  overflow-x: auto;
}

.mt-code-block__copy {
  position: absolute;
  inset-block-start: var(--scale-size-6);
  inset-inline-end: var(--scale-size-6);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.mt-code-block:hover .mt-code-block__copy,
.mt-code-block:focus-within .mt-code-block__copy {
  opacity: 1;
}

/* Without hover, the button is always visible. */
@media (hover: none) {
  .mt-code-block__copy {
    opacity: 1;
  }
}
</style>
