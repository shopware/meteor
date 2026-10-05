<template>
  <span class="mt-attachment" :title="name">
    <img v-if="previewUrl" class="mt-attachment__preview" :src="previewUrl" alt="" />
    <mt-icon v-else-if="iconName" :name="iconName" size="12" decorative />

    <mt-text as="span" size="2xs" weight="medium" class="mt-attachment__label">{{ name }}</mt-text>

    <button
      v-if="removable"
      type="button"
      class="mt-attachment__remove"
      :aria-label="t('remove', { name })"
      @click="$emit('remove')"
    >
      <mt-icon name="regular-times-xs" size="8" decorative />
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed, shallowRef, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * Something attached to an AI prompt or message: a file with an image preview or a file icon,
 * or a reference such as the product a prompt is about.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The attached file. Images show a preview, other files a file icon. */
    file?: File;
    /**
     * The address of a file that is not available as a `File`, for example from a stored message.
     * Images show it as a preview.
     */
    url?: string;
    /** The media type of `url`, such as `image/png` or just `image`. */
    mediaType?: string;
    /** The visible name. Defaults to the name of `file`. */
    label?: string;
    /** An icon for attachments without a file, such as `regular-products`. */
    icon?: string;
    /** Shows a button that emits `remove`. */
    removable?: boolean;
  }>(),
  {
    file: undefined,
    url: undefined,
    mediaType: undefined,
    label: undefined,
    icon: undefined,
    removable: false,
  },
);

defineEmits<{
  /** Emitted when the remove button is clicked. */
  remove: [];
}>();

const { t } = useI18n({
  messages: {
    en: { remove: "Remove {name}" },
    de: { remove: "{name} entfernen" },
  },
});

const name = computed(() => props.label ?? props.file?.name ?? "");

const type = computed(() => props.file?.type ?? props.mediaType);
// A media type may be given as just its top-level type, such as `image`.
const isImage = computed(
  () => type.value === "image" || (type.value?.startsWith("image/") ?? false),
);

const iconName = computed(() => {
  if (props.icon) return props.icon;
  if (type.value === undefined) return undefined;

  return isImage.value ? "regular-image-xs" : "regular-file";
});

const fileUrl = shallowRef<string>();

watchEffect((onCleanup) => {
  const file = props.file;
  if (!file?.type.startsWith("image/") || typeof URL.createObjectURL !== "function") {
    fileUrl.value = undefined;
    return;
  }

  const url = URL.createObjectURL(file);
  fileUrl.value = url;
  onCleanup(() => URL.revokeObjectURL(url));
});

const previewUrl = computed(() => fileUrl.value ?? (isImage.value ? props.url : undefined));
</script>

<style>
.mt-attachment {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-4);
  box-sizing: border-box;
  max-width: 100%;
  height: var(--scale-size-24);
  padding-inline: var(--scale-size-8);
  color: var(--color-text-primary-default);
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.mt-attachment > .mt-icon {
  flex: none;
  color: var(--color-icon-secondary-default);
}

.mt-attachment__preview {
  flex: none;
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  object-fit: cover;
  border-radius: var(--border-radius-2xs);
}

.mt-attachment__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mt-attachment__remove {
  display: grid;
  flex: none;
  place-items: center;
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  margin-inline-end: calc(var(--scale-size-2) * -1);
  padding: 0;
  color: var(--color-icon-secondary-default);
  background: none;
  border: none;
  border-radius: var(--border-radius-2xs);
  cursor: pointer;
}

.mt-attachment__remove:hover {
  color: var(--color-icon-primary-default);
  background-color: var(--color-interaction-secondary-hover);
}

.mt-attachment__remove:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: 0;
}
</style>
