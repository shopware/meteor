<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtPage,
  MtPanel,
  MtText,
  MtTextField,
} from "@shopware-ag/meteor-component-library";

type BlockType = "heading" | "text" | "image";

interface Block {
  id: number;
  type: BlockType;
  content: string;
}

const icons: Record<BlockType, string> = {
  heading: "regular-layout",
  text: "regular-align-left",
  image: "regular-image",
};

const props = defineProps<{
  /** Shown on its own route, for which the shell hides its header and sidebar. */
  fullScreen?: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

const breadcrumb = computed(() =>
  props.fullScreen
    ? [
        { label: t("editor.title"), icon: "image-text", to: "/editor" },
        { label: t("editor.fullScreen") },
      ]
    : [{ label: t("editor.title"), icon: "image-text" }],
);

// Placeholder content: a page made of blocks, edited in the panels next to it.
const blocks = ref<Block[]>([
  { id: 1, type: "heading", content: "Welcome to the playground" },
  {
    id: 2,
    type: "text",
    content: "Pick a block on the left and change it on the right.",
  },
  { id: 3, type: "image", content: "Hero image" },
  { id: 4, type: "text", content: "A second paragraph below the image." },
]);
const selectedId = ref(1);
const selected = computed(() =>
  blocks.value.find((block) => block.id === selectedId.value),
);
</script>

<template>
  <!-- A lower breakpoint keeps both panels next to the canvas while the shell's panels are open. -->
  <mt-page :breadcrumb="breadcrumb" :breakpoint="720" :closable="fullScreen">
    <template v-if="!fullScreen" #actions>
      <mt-button
        variant="secondary"
        size="small"
        @click="router.push('/editor/full-screen')"
      >
        <template #iconFront>
          <mt-icon
            name="regular-expand-arrows-s"
            size="var(--scale-size-12)"
            decorative
          />
        </template>
        {{ t("editor.fullScreen") }}
      </mt-button>
    </template>

    <template #start>
      <mt-panel :label="t('editor.blocks')" closable resizable>
        <aside class="editor-blocks" :aria-label="t('editor.blocks')">
          <button
            v-for="block in blocks"
            :key="block.id"
            type="button"
            class="editor-blocks__item"
            :aria-pressed="block.id === selectedId"
            @click="selectedId = block.id"
          >
            <mt-icon
              :name="icons[block.type]"
              size="16"
              class="editor-blocks__icon"
              decorative
            />
            <mt-text as="span" size="xs" class="editor-blocks__label">
              {{ block.content }}
            </mt-text>
          </button>
        </aside>
      </mt-panel>
    </template>

    <div class="editor-canvas">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="editor-canvas__block"
        :class="{ 'is--selected': block.id === selectedId }"
      >
        <mt-text
          v-if="block.type === 'heading'"
          as="h2"
          size="xl"
          weight="bold"
        >
          {{ block.content }}
        </mt-text>
        <div v-else-if="block.type === 'image'" class="editor-canvas__image">
          <mt-icon name="regular-image" size="24" decorative />
          <mt-text size="xs" color="color-text-secondary-default">
            {{ block.content }}
          </mt-text>
        </div>
        <mt-text v-else size="s">{{ block.content }}</mt-text>
      </div>
    </div>

    <template #end>
      <mt-panel :label="t('editor.properties')" closable resizable>
        <aside class="editor-properties" :aria-label="t('editor.properties')">
          <template v-if="selected">
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t(`editor.types.${selected.type}`) }}
            </mt-text>
            <mt-text-field
              v-model="selected.content"
              :label="t('editor.content')"
            />
          </template>
        </aside>
      </mt-panel>
    </template>
  </mt-page>
</template>

<style scoped>
.editor-blocks,
.editor-properties {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  padding: var(--scale-size-12);
}

.editor-properties {
  gap: var(--scale-size-12);
  padding: var(--scale-size-16);
}

.editor-blocks__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  padding: var(--scale-size-8);
  color: var(--color-icon-primary-default);
  text-align: start;
  background: none;
  border: none;
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.editor-blocks__item:hover {
  background-color: var(--color-background-secondary-default);
}

.editor-blocks__item[aria-pressed="true"] {
  background-color: var(--color-background-brand-default);
}

.editor-blocks__item:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.editor-blocks__icon {
  flex-shrink: 0;
}

.editor-blocks__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.editor-canvas {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}

.editor-canvas__block {
  padding: var(--scale-size-12);
  border: var(--scale-size-1) dashed transparent;
  border-radius: var(--border-radius-s);
}

.editor-canvas__block.is--selected {
  border-color: var(--color-border-brand-default);
}

.editor-canvas__image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-8);
  height: var(--scale-size-160);
  color: var(--color-icon-secondary-default);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-s);
}
</style>
