<template>
  <span class="mt-copy-button">
    <mt-tooltip ref="tooltip" :content="accessibleLabel">
      <template #default="tooltipProps">
        <!-- The tooltip repeats the label, so it must not also become the description -->
        <mt-button
          v-bind="tooltipProps"
          :aria-describedby="undefined"
          :aria-label="accessibleLabel"
          :variant="variant"
          :size="buttonSizes[size]"
          :disabled="disabled"
          square
          @click="onClick"
        >
          <template #iconFront>
            <mt-icon :name="icon" :size="iconSize" decorative />
          </template>
        </mt-button>
      </template>
    </mt-tooltip>

    <span class="visually-hidden" aria-live="polite">{{ announcement }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtTooltip from "../mt-tooltip/mt-tooltip.vue";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";

const props = withDefaults(
  defineProps<{
    /** The text that is written to the clipboard. */
    value: string;
    /**
     * Accessible name and tooltip before copying. Name the copied value when
     * several copy buttons are on the page, for example "Copy order number".
     */
    label?: string;
    variant?: "primary" | "secondary" | "tertiary" | "critical";
    size?: "xs" | "s" | "m" | "l";
    disabled?: boolean;
  }>(),
  {
    label: undefined,
    variant: "secondary",
    size: "s",
    disabled: false,
  },
);

const emit = defineEmits<{
  /** Emitted after the value was written to the clipboard. */
  (e: "copy", value: string): void;
  /** Emitted when the Clipboard API is unavailable or the write was blocked. */
  (e: "error", error: unknown): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      "mt-copy-button": {
        copy: "Copy",
        copied: "Copied",
        failed: "Copy failed",
      },
    },
    de: {
      "mt-copy-button": {
        copy: "Kopieren",
        copied: "Kopiert",
        failed: "Kopieren fehlgeschlagen",
      },
    },
  },
});

const { status, error, copy } = useCopyToClipboard();
const tooltip = useTemplateRef("tooltip");

const announcement = computed(() => {
  if (status.value === "copied") return t("mt-copy-button.copied");
  if (status.value === "failed") return t("mt-copy-button.failed");
  return "";
});

const accessibleLabel = computed(
  () => announcement.value || props.label || t("mt-copy-button.copy"),
);

const icon = computed(() => {
  const name = status.value === "copied" ? "regular-checkmark" : "regular-copy";
  return props.size === "m" || props.size === "l" ? name : `${name}-s`;
});

const buttonSizes = {
  xs: "x-small",
  s: "small",
  m: "default",
  l: "large",
} as const;

// Button's icon sizes are meant for icons next to text, an icon-only button needs larger ones
const iconSizes = {
  xs: "var(--scale-size-8)",
  s: "var(--scale-size-12)",
  m: "var(--scale-size-16)",
  l: "var(--scale-size-20)",
} as const;
const iconSize = computed(() => iconSizes[props.size]);

async function onClick() {
  if (await copy(props.value)) {
    emit("copy", props.value);
  } else {
    emit("error", error.value);
  }

  tooltip.value?.show();
}
</script>

<style scoped>
.mt-copy-button {
  display: inline-flex;
}
</style>
