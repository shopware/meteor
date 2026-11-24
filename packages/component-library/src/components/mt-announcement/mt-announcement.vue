<template>
  <div
    class="mt-announcement"
    :class="[`mt-announcement--variant-${variant}`, { 'mt-announcement--closable': closable }]"
  >
    <div class="mt-announcement__message">
      <span v-if="icon" class="mt-announcement__icon">
        <mt-icon :name="resolveIconName(icon, 'solid')" size="var(--scale-size-16)" decorative />
      </span>
      <slot />
    </div>

    <button
      v-if="closable"
      type="button"
      class="mt-announcement__close"
      :aria-label="t('close')"
      @click="emit('close')"
    >
      <mt-icon name="regular-times" size="var(--scale-size-10)" decorative />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import { resolveIconName } from "@/utils/icon";

/**
 * A full-width message at the top of an application, such as planned downtime or an upcoming
 * event, usually in the `announcement` slot of `mt-app`. The text wraps and is never cut off.
 *
 * @experimental The API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /**
     * The meaning and color of the announcement.
     *
     * @values neutral, info, attention, critical, positive
     */
    variant?: "neutral" | "info" | "attention" | "critical" | "positive";
    /** An icon at the start of the message, always in the solid style. */
    icon?: string;
    /** Shows a close button. */
    closable?: boolean;
  }>(),
  {
    variant: "neutral",
    icon: undefined,
    closable: false,
  },
);

const emit = defineEmits<{
  /** The close button was clicked. */
  close: [];
}>();

defineSlots<{
  /** The message: text, with links and emphasis as inline elements. */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { close: "Close announcement" },
    de: { close: "Ankündigung schließen" },
  },
});
</script>

<style scoped>
.mt-announcement {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-8);
  padding: var(--scale-size-8) var(--scale-size-16);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
  background-color: var(--mt-announcement-background);
  border-block-end: 1px solid var(--mt-announcement-border-color);
}

.mt-announcement__message {
  flex: 1;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
}

/* The close button sits as far from the end as from the top. */
.mt-announcement--closable {
  --mt-announcement-close-inset: calc(
    var(--scale-size-8) + (var(--font-line-height-xs) - var(--scale-size-24)) / 2
  );
  padding-inline-end: var(--mt-announcement-close-inset);
}

/* As wide as the close button, its gap and its inset on the other side, so the text stays centered
   on the whole width. */
@media (width >= 640px) {
  .mt-announcement--closable .mt-announcement__message {
    padding-inline-start: calc(
      var(--mt-announcement-close-inset) + var(--scale-size-24) + var(--scale-size-8) -
        var(--scale-size-16)
    );
  }
}

/* Below the compact width of mt-page, wrapped lines read better from a common start. */
@media (width < 640px) {
  .mt-announcement__message {
    text-align: start;
  }
}

/* One line box tall, so the icon stays centered on the first line however the text wraps. */
.mt-announcement__icon {
  display: inline-flex;
  align-items: center;
  height: var(--font-line-height-xs);
  margin-inline-end: var(--scale-size-8);
  color: var(--mt-announcement-icon-color);
  vertical-align: top;
}

.mt-announcement__close {
  display: grid;
  flex: none;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  /* Centered on the first line, without making the announcement taller. */
  margin-block: calc((var(--font-line-height-xs) - var(--scale-size-24)) / 2);
  padding: 0;
  border: none;
  border-radius: var(--border-radius-button);
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}

.mt-announcement__close:hover {
  /* stylelint-disable-next-line meteor/prefer-background-token -- No token tints every variant, the text color does */
  background-color: color-mix(in srgb, currentColor 12%, transparent);
}

.mt-announcement__close:active {
  /* stylelint-disable-next-line meteor/prefer-background-token -- No token tints every variant, the text color does */
  background-color: color-mix(in srgb, currentColor 20%, transparent);
}

.mt-announcement__close:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-announcement :deep(a) {
  display: inline;
  color: inherit;
  text-decoration: underline;
}

.mt-announcement :deep(a:is(:hover, :active)) {
  color: inherit;
  opacity: 0.8;
}

.mt-announcement :deep(a:focus-visible) {
  outline-color: var(--color-border-brand-default);
}

.mt-announcement--variant-neutral {
  --mt-announcement-background: var(--color-background-secondary-default);
  --mt-announcement-icon-color: var(--color-icon-primary-default);
  --mt-announcement-border-color: var(--color-border-secondary-default);
}

.mt-announcement--variant-info {
  --mt-announcement-background: var(--color-background-brand-default);
  --mt-announcement-icon-color: var(--color-icon-brand-default);
  --mt-announcement-border-color: color-mix(
    in srgb,
    var(--color-border-brand-default) 20%,
    transparent
  );
}

.mt-announcement--variant-attention {
  --mt-announcement-background: var(--color-background-attention-default);
  --mt-announcement-icon-color: var(--color-icon-attention-default);
  --mt-announcement-border-color: color-mix(
    in srgb,
    var(--color-border-attention-default) 20%,
    transparent
  );
}

.mt-announcement--variant-critical {
  --mt-announcement-background: var(--color-background-critical-default);
  --mt-announcement-icon-color: var(--color-icon-critical-default);
  --mt-announcement-border-color: color-mix(
    in srgb,
    var(--color-border-critical-default) 20%,
    transparent
  );
}

.mt-announcement--variant-positive {
  --mt-announcement-background: var(--color-background-positive-default);
  --mt-announcement-icon-color: var(--color-icon-positive-default);
  --mt-announcement-border-color: color-mix(
    in srgb,
    var(--color-border-positive-default) 20%,
    transparent
  );
}
</style>
