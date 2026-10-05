<template>
  <div
    class="mt-prompt-field"
    :class="{
      'mt-prompt-field--disabled': disabled,
      'mt-prompt-field--dragging': isDragging,
    }"
    :style="{
      '--mt-prompt-field-min-rows': rows.min ?? 2,
      '--mt-prompt-field-max-rows': rows.max ?? 8,
    }"
    @dragenter="!globalDrop && onDragEnter($event)"
    @dragover="!globalDrop && onDragOver($event)"
    @dragleave="!globalDrop && onDragLeave($event)"
    @drop="!globalDrop && onDrop($event)"
  >
    <div v-if="files.length > 0 || hasSlotContent(slots.header)" class="mt-prompt-field__header">
      <mt-attachment
        v-for="file in files"
        :key="fileKey(file)"
        :file="file"
        removable
        @remove="removeFile(file)"
      />
      <slot name="header" />
    </div>

    <textarea
      ref="textarea"
      v-model="model"
      class="mt-prompt-field__textarea"
      :rows="rows.min ?? 2"
      :name="name"
      :placeholder="placeholder"
      :aria-label="label ?? t('label')"
      :disabled="disabled"
      @keydown="onKeydown"
      @paste="onPaste"
    />

    <div class="mt-prompt-field__footer">
      <div v-if="hasSlotContent(slots.tools)" class="mt-prompt-field__tools">
        <slot name="tools" />
      </div>

      <div v-if="hasSlotContent(slots['tools-end'])" class="mt-prompt-field__tools-end">
        <slot name="tools-end" />
      </div>

      <mt-button
        class="mt-prompt-field__submit"
        :variant="isRunning ? 'secondary' : 'primary'"
        square
        :disabled="disabled || (!isRunning && !canSubmit)"
        :aria-label="isRunning ? t('stop') : t('submit')"
        @click="onButtonClick"
      >
        <template #iconFront>
          <transition name="mt-prompt-field-icon" mode="out-in" type="transition">
            <span v-if="status === 'submitted'" class="mt-prompt-field__spinner" />
            <mt-icon v-else-if="status === 'streaming'" name="solid-square" size="10" decorative />
            <mt-icon v-else name="solid-paper-plane" size="14" decorative />
          </transition>
        </template>
      </mt-button>
    </div>

    <input
      v-if="accept"
      ref="fileInput"
      type="file"
      hidden
      tabindex="-1"
      :accept="accept"
      :multiple="maxFiles !== 1"
      @change="onFileInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useEventListener, useTextareaAutosize } from "@vueuse/core";
import MtAttachment from "@/components/mt-attachment/mt-attachment.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import type { MtChatStatus } from "@/types/ai";
import { hasSlotContent } from "@/utils/slot";
import { promptFieldContextKey } from "./composables/usePromptFieldContext";
import type { MtPromptFieldError, MtPromptFieldMessage } from "./mt-prompt-field.types";

/**
 * The input of an AI prompt: a textarea that grows with the prompt, optional file attachments,
 * slots for the context above the input and for tools below it, and a submit button that
 * becomes a stop button while a request runs.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The accessible name of the textarea. Defaults to a translated "Prompt". */
    label?: string;
    /** Shown while the prompt is empty. */
    placeholder?: string;
    /** Disables the textarea, the submit button and the tools that use the field's state. */
    disabled?: boolean;
    /** The name of the native textarea. */
    name?: string;
    /**
     * The state of the request. While `submitted` or `streaming`, the submit button becomes a
     * stop button that emits `stop`, and `submit` is not emitted.
     */
    status?: MtChatStatus;
    /**
     * `enter` submits with Enter and adds a line break with Shift+Enter, `mod-enter` submits with
     * Ctrl+Enter or Cmd+Enter, `none` only submits with the button.
     */
    submitMode?: "enter" | "mod-enter" | "none";
    /** The number of lines the textarea starts with and grows to before it scrolls. */
    rows?: { min?: number; max?: number };
    /**
     * The file types that can be attached, like the `accept` attribute of a file input, for
     * example `"image/*,.pdf"`. Without it, no files can be attached.
     */
    accept?: string;
    /** The maximum number of attached files. */
    maxFiles?: number;
    /** The maximum size of an attached file in bytes. */
    maxFileSize?: number;
    /** Accepts files dropped anywhere on the page instead of only on the field. */
    globalDrop?: boolean;
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    disabled: false,
    name: undefined,
    status: "ready",
    submitMode: "enter",
    rows: () => ({ min: 2, max: 8 }),
    accept: undefined,
    maxFiles: undefined,
    maxFileSize: undefined,
    globalDrop: false,
  },
);

const model = defineModel<string>({ default: "" });

/** The attached files. */
const files = defineModel<File[]>("files", { default: () => [] });

const emit = defineEmits<{
  /**
   * Emitted with the text and the attached files when the prompt is sent. The field is cleared
   * afterwards. Not emitted for an empty prompt or while a request runs.
   */
  submit: [message: MtPromptFieldMessage];
  /** Emitted when the user stops a running request with the stop button or Escape. */
  stop: [];
  /** Emitted when attached files are rejected. */
  error: [error: MtPromptFieldError];
}>();

const slots = defineSlots<{
  /** Content above the textarea, such as the active context or a running task. */
  header?(): unknown;
  /** Tools at the start of the bar below the textarea, such as `mt-prompt-field-action-menu`. */
  tools?(): unknown;
  /** Tools before the submit button, such as `mt-prompt-field-model-select`. */
  "tools-end"?(): unknown;
}>();

const { t, locale } = useI18n({
  messages: {
    en: {
      label: "Prompt",
      submit: "Submit prompt",
      stop: "Stop prompt",
      errorAccept: "These files have a type that cannot be attached: {names}",
      errorMaxFileSize: "These files are larger than {size}: {names}",
      errorMaxFiles: "Only {max} files can be attached.",
    },
    de: {
      label: "Prompt",
      submit: "Prompt absenden",
      stop: "Prompt stoppen",
      errorAccept: "Diese Dateien haben einen Typ, der nicht angehängt werden kann: {names}",
      errorMaxFileSize: "Diese Dateien sind größer als {size}: {names}",
      errorMaxFiles: "Es können nur {max} Dateien angehängt werden.",
    },
  },
});

const textarea = useTemplateRef<HTMLTextAreaElement>("textarea");
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

useTextareaAutosize({ element: textarea, input: model });

const isRunning = computed(() => props.status === "submitted" || props.status === "streaming");

const canSubmit = computed(
  () =>
    !props.disabled && !isRunning.value && (model.value.trim() !== "" || files.value.length > 0),
);

function submit() {
  if (!canSubmit.value) return;

  emit("submit", { text: model.value, files: [...files.value] });
  model.value = "";
  files.value = [];
}

function stop() {
  if (isRunning.value) emit("stop");
}

function focus() {
  textarea.value?.focus();
}

function onButtonClick() {
  if (isRunning.value) stop();
  else submit();

  focus();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isRunning.value) {
    // marks the key as handled, so a drawer or modal around the field stays open
    event.preventDefault();
    stop();
    return;
  }

  if (event.key === "Backspace" && model.value === "" && files.value.length > 0) {
    event.preventDefault();
    removeFile(files.value[files.value.length - 1]);
    return;
  }

  // Safari confirms an IME composition with an Enter whose isComposing is false
  if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) return;

  const submits =
    props.submitMode === "enter"
      ? !event.shiftKey
      : props.submitMode === "mod-enter" && (event.metaKey || event.ctrlKey);
  if (!submits) return;

  event.preventDefault();
  submit();
}

const fileKeys = new WeakMap<File, number>();
let nextFileKey = 0;

function fileKey(file: File) {
  let key = fileKeys.get(file);
  if (key === undefined) {
    key = nextFileKey++;
    fileKeys.set(file, key);
  }

  return key;
}

function isAccepted(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return (props.accept ?? "")
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .some((pattern) => {
      if (pattern === "*" || pattern === "*/*") return true;
      if (pattern.startsWith(".")) return name.endsWith(pattern);
      if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));

      return pattern !== "" && type === pattern;
    });
}

function formatSize(bytes: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "unit",
    unit: "megabyte",
    maximumFractionDigits: 1,
  }).format(bytes / 1_000_000);
}

function reject(code: MtPromptFieldError["code"], rejected: File[]) {
  if (rejected.length === 0) return;

  const names = rejected.map((file) => file.name).join(", ");
  const message =
    code === "accept"
      ? t("errorAccept", { names })
      : code === "max_file_size"
        ? t("errorMaxFileSize", { names, size: formatSize(props.maxFileSize ?? 0) })
        : t("errorMaxFiles", { max: props.maxFiles ?? 0 });

  emit("error", { code, message, files: rejected });
}

function addFiles(added: File[] | FileList) {
  if (!props.accept || props.disabled) return;

  const candidates = Array.from(added);
  const wrongType = candidates.filter((file) => !isAccepted(file));
  const tooLarge = candidates.filter(
    (file) => isAccepted(file) && props.maxFileSize !== undefined && file.size > props.maxFileSize,
  );
  const valid = candidates.filter((file) => !wrongType.includes(file) && !tooLarge.includes(file));
  const room =
    props.maxFiles === undefined ? valid.length : Math.max(0, props.maxFiles - files.value.length);

  if (valid.length > 0 && room > 0) files.value = [...files.value, ...valid.slice(0, room)];

  reject("accept", wrongType);
  reject("max_file_size", tooLarge);
  reject("max_files", valid.slice(room));
}

function removeFile(file: File) {
  files.value = files.value.filter((attached) => attached !== file);
}

function openFileDialog() {
  if (!props.disabled) fileInput.value?.click();
}

function onFileInput() {
  const input = fileInput.value;
  if (!input?.files) return;

  addFiles(input.files);
  input.value = "";
}

function onPaste(event: ClipboardEvent) {
  const pasted = Array.from(event.clipboardData?.files ?? []);
  if (!props.accept || pasted.length === 0) return;

  event.preventDefault();
  addFiles(pasted);
}

const isDragging = ref(false);
let dragDepth = 0;

function carriesFiles(event: DragEvent) {
  return !!props.accept && !props.disabled && !!event.dataTransfer?.types.includes("Files");
}

function onDragEnter(event: DragEvent) {
  if (!carriesFiles(event)) return;

  dragDepth++;
  isDragging.value = true;
}

function onDragOver(event: DragEvent) {
  if (carriesFiles(event)) event.preventDefault();
}

function onDragLeave(event: DragEvent) {
  if (!carriesFiles(event)) return;

  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) isDragging.value = false;
}

function onDrop(event: DragEvent) {
  dragDepth = 0;
  isDragging.value = false;
  if (!carriesFiles(event)) return;

  event.preventDefault();
  addFiles(event.dataTransfer?.files ?? []);
}

const pageDropTarget = () =>
  props.globalDrop && typeof document !== "undefined" ? document : undefined;

useEventListener(pageDropTarget, "dragenter", onDragEnter);
useEventListener(pageDropTarget, "dragover", onDragOver);
useEventListener(pageDropTarget, "dragleave", onDragLeave);
useEventListener(pageDropTarget, "drop", onDrop);

provide(promptFieldContextKey, {
  status: computed(() => props.status),
  disabled: computed(() => props.disabled),
  files,
  addFiles,
  removeFile,
  openFileDialog,
  submit,
  stop,
  focus,
});
</script>

<style>
.mt-prompt-field {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-primary-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.mt-prompt-field:has(.mt-prompt-field__textarea:focus-visible) {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-prompt-field--dragging {
  outline: var(--scale-size-2) dashed var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-prompt-field--disabled {
  background-color: var(--color-background-tertiary-default);
}

.mt-prompt-field__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-4) var(--scale-size-8);
  padding: var(--scale-size-8);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.mt-prompt-field__textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(var(--mt-prompt-field-min-rows) * 1lh + var(--scale-size-16));
  max-height: calc(var(--mt-prompt-field-max-rows) * 1lh + var(--scale-size-16));
  padding: var(--scale-size-12) var(--scale-size-16) var(--scale-size-4);
  overflow-y: auto;
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
}

.mt-prompt-field__textarea::placeholder {
  color: var(--color-text-secondary-default);
}

.mt-prompt-field__textarea:disabled {
  color: var(--color-text-primary-disabled);
  cursor: not-allowed;
}

.mt-prompt-field__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-8);
  padding: var(--scale-size-4) var(--scale-size-8) var(--scale-size-8);
}

.mt-prompt-field__tools,
.mt-prompt-field__tools-end {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  min-width: 0;
}

/* The tools and the submit button keep their size; only the end tools, such as a model name, shrink. */
.mt-prompt-field__tools {
  flex-shrink: 0;
  margin-inline-end: auto;
}

.mt-prompt-field__submit {
  flex-shrink: 0;
}

.mt-prompt-field__spinner {
  display: inline-block;
  box-sizing: border-box;
  width: var(--scale-size-12);
  height: var(--scale-size-12);
  vertical-align: middle;
  border: var(--scale-size-2) solid currentColor;
  border-inline-end-color: transparent;
  border-radius: var(--border-radius-round);
  animation: mt-prompt-field-spin 0.8s linear infinite;
}

@keyframes mt-prompt-field-spin {
  to {
    transform: rotate(360deg);
  }
}

.mt-prompt-field-icon-enter-active,
.mt-prompt-field-icon-leave-active {
  transition:
    opacity 0.1s ease-out,
    transform 0.1s ease-out;
}

.mt-prompt-field-icon-enter-from,
.mt-prompt-field-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@media (prefers-reduced-motion: reduce) {
  .mt-prompt-field__spinner {
    animation-duration: 2.4s;
  }

  .mt-prompt-field-icon-enter-active,
  .mt-prompt-field-icon-leave-active {
    transition: none;
  }
}
</style>
