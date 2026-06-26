<template>
  <mt-modal-root :is-open="isOpen" @change="onChangeOpen">
    <mt-modal :title="t('mt.text-editor.diff.title')" width="l">
      <template #default>
        <MtText
          as="div"
          size="s"
          color="color-text-primary-default"
          class="mt-text-editor__diff-info"
        >
          {{ t("mt.text-editor.diff.subtitle") }}
        </MtText>

        <div class="mt-text-editor__diff-headlines">
          <h3 class="mt-text-editor__diff-headline-current">
            {{ t("mt.text-editor.diff.headlines.current") }}
          </h3>
          <h3 class="mt-text-editor__diff-headline-new">
            {{ t("mt.text-editor.diff.headlines.new") }}
          </h3>
        </div>

        <div class="mt-text-editor__diff-container">
          <DiffView
            :data="{
              oldFile: { fileName: 'Code', fileLang: 'html', content: originalHtml },
              newFile: { fileName: 'WYSIWYG', fileLang: 'html', content: parsedHtml },
              hunks: diffHunks,
            }"
            :diff-view-mode="DiffModeEnum.SplitGitHub"
            :diff-view-theme="diffViewTheme"
          />
        </div>
      </template>
      <template #footer>
        <div class="mt-text-editor__diff-footer">
          <mt-button variant="secondary" @click="emitCancel">
            {{ t("mt.text-editor.diff.cancel") }}
          </mt-button>
          <mt-button variant="critical" @click="emitAccept">
            {{ t("mt.text-editor.diff.accept") }}
          </mt-button>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted, watch } from "vue";
import { useMeteorI18n } from "@/composables/use-meteor-i18n";
import { meteorTextEditorMessages } from "../mt-text-editor.i18n";
import "@git-diff-view/vue/styles/diff-view-pure.css";
import { DiffView, DiffModeEnum } from "@git-diff-view/vue";
import MtModal from "@/components/overlay/mt-modal/mt-modal.vue";
import MtModalRoot from "@/components/overlay/mt-modal/sub-components/mt-modal-root.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { createTwoFilesPatch } from "diff";

const props = defineProps<{
  isOpen: boolean;
  originalHtml: string;
  parsedHtml: string;
}>();

const emit = defineEmits<{
  (e: "accept"): void;
  (e: "cancel"): void;
  (e: "changeOpen", value: boolean): void;
}>();

const { t } = useMeteorI18n({ messages: meteorTextEditorMessages });

const emitAccept = () => {
  emit("accept");
};

const emitCancel = () => {
  emit("cancel");
};

const onChangeOpen = (value: boolean) => {
  emit("changeOpen", value);
};

const diffHunks = computed(() => {
  try {
    const oldStr = props.originalHtml ?? "";
    const newStr = props.parsedHtml ?? "";
    const patch = createTwoFilesPatch("Code", "WYSIWYG", oldStr, newStr, "", "", { context: 3 });
    return [patch];
  } catch {
    return [] as string[];
  }
});

const isDark = ref(false);

watch(
  () => props.isOpen,
  () => {
    isDark.value = document.body.getAttribute("data-theme") === "dark";
  },
);

const diffViewTheme = computed(() => {
  return isDark.value ? "dark" : "light";
});
</script>

<style scoped>
.mt-text-editor__diff-info {
  margin: 0 0 var(--scale-size-16);
}

.mt-text-editor__diff-headlines {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--scale-size-16);
  align-items: center;
  margin-bottom: var(--scale-size-2);
}

.mt-text-editor__diff-headline-current,
.mt-text-editor__diff-headline-new {
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  color: var(--color-text-secondary-default);
  font-weight: var(--font-weight-regular);
  margin: 0;
}

.mt-text-editor__diff-headline-new {
  text-align: right;
}

.mt-text-editor__diff-container {
  max-height: 60vh;
  overflow: auto;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.mt-text-editor__diff-container :deep(.diff-tailwindcss-wrapper) {
  /* Keep Tailwind utility defaults local to the diff view. */
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  --tw-contain-size: ;
  --tw-contain-layout: ;
  --tw-contain-paint: ;
  --tw-contain-style: ;
}

.mt-text-editor__diff-footer {
  display: flex;
  gap: var(--scale-size-8);
  justify-content: flex-end;
  width: 100%;
}
</style>
