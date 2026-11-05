<script setup lang="ts">
import { useClipboard, useElementSize } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    /** Block component name, e.g. "detail-page-block". */
    name: string;
    /**
     * Height of the preview in pixels. Without it, the preview has the 16:9
     * ratio of a screen, at least 480px tall and never taller than the window.
     */
    height?: number | string;
  }>(),
  {
    height: undefined,
  },
);

const viewTabs = [
  { label: "Preview", value: "preview" },
  { label: "Code", value: "code" },
];

const view = ref("preview");

const src = `/block-preview/${props.name}`;

// The preview and the code view share their size, so switching between them
// keeps the page still. The ratio follows the width of the column, not the
// width set with the handle.
const sizeClass = props.height
  ? undefined
  : "w-full aspect-video min-h-120 max-h-[calc(100dvh_-_var(--ui-header-height)_-_6rem)]";
const sizeStyle = props.height ? { height: `${props.height}px` } : undefined;

const MIN_WIDTH = 320;
const HANDLE_WIDTH = 24;

const stage = useTemplateRef("stage");
const { width: stageWidth } = useElementSize(stage);

// The width set with the handle. Until it is used, the frame fills the stage.
const width = ref<number>();
const maxWidth = computed(() => Math.max(MIN_WIDTH, stageWidth.value));
const frameWidth = computed(() =>
  Math.round(Math.min(width.value ?? Infinity, maxWidth.value)),
);

function resizeTo(value: number) {
  width.value = Math.min(Math.max(value, MIN_WIDTH), maxWidth.value);
}

// The iframe would swallow the pointer events while the pointer is over it,
// so it ignores them during a drag.
const isDragging = ref(false);
let dragStart = { x: 0, width: 0 };

function onPointerDown(event: PointerEvent) {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  dragStart = { x: event.clientX, width: frameWidth.value };
  isDragging.value = true;
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return;
  resizeTo(dragStart.width + event.clientX - dragStart.x);
}

function onKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 64 : 16;
  if (event.key === "ArrowLeft") resizeTo(frameWidth.value - step);
  else if (event.key === "ArrowRight") resizeTo(frameWidth.value + step);
  else if (event.key === "Home") resizeTo(MIN_WIDTH);
  else if (event.key === "End") width.value = undefined;
  else return;
  event.preventDefault();
}

const { sourceText, ast, ready } = useExampleSource(props.name);
await ready;

const { copy, copied } = useClipboard();

// Cmd/Ctrl+A in the code view selects the code instead of the whole page.
const code = useTemplateRef("code");

function onCodeKeydown(event: KeyboardEvent) {
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "a") {
    return;
  }
  const target = code.value?.querySelector("pre") ?? code.value;
  if (!target) return;
  event.preventDefault();
  const range = document.createRange();
  range.selectNodeContents(target);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
}
</script>

<template>
  <div class="block-preview my-5">
    <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
      <UTabs
        v-model="view"
        :items="viewTabs"
        :content="false"
        variant="pill"
        size="md"
        :ui="{ list: 'p-0.5', indicator: 'inset-y-0.5', trigger: 'py-1 data-[state=active]:text-white' }"
      />

      <div class="flex items-center gap-2">
        <UBadge
          v-show="view === 'preview' && stageWidth"
          :label="`${frameWidth}px`"
          color="neutral"
          variant="soft"
          class="tabular-nums"
        />

        <UButton
          :to="src"
          target="_blank"
          trailing-icon="i-lucide-external-link"
          label="Open in new tab"
          color="neutral"
          variant="outline"
          size="md"
          :ui="{ trailingIcon: 'text-neutral size-3.5' }"
        />
      </div>
    </div>

    <div v-show="view === 'preview'" class="relative">
      <div
        ref="stage"
        class="flex overflow-hidden rounded-md border border-muted bg-default contain-[inline-size]"
        :class="sizeClass"
        :style="sizeStyle"
      >
        <iframe
          :src="src"
          :title="`Preview of ${name}`"
          loading="lazy"
          class="block h-full shrink-0 border-0 border-muted"
          :class="{
            'pointer-events-none': isDragging,
            'border-e': frameWidth < maxWidth,
          }"
          :style="{ width: stageWidth ? `${frameWidth}px` : '100%' }"
        />
      </div>

      <!-- Sits next to the right edge of the frame, outside the border while the
           frame fills the stage. -->
      <div
        v-show="stageWidth"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize the preview"
        :aria-valuenow="frameWidth"
        :aria-valuemin="MIN_WIDTH"
        :aria-valuemax="maxWidth"
        tabindex="0"
        class="group absolute top-0 hidden h-full cursor-ew-resize touch-none items-center justify-center outline-none lg:flex"
        :style="{ left: `${frameWidth + 2}px`, width: `${HANDLE_WIDTH}px` }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="isDragging = false"
        @pointercancel="isDragging = false"
        @dblclick="width = undefined"
        @keydown="onKeydown"
      >
        <span
          class="h-16 w-1.5 rounded-full bg-(--ui-border-accented) transition-colors group-hover:bg-(--ui-text-muted) group-focus-visible:bg-(--ui-primary)"
          :class="{ 'bg-(--ui-text-muted)': isDragging }"
        />
      </div>
    </div>

    <div v-show="view === 'code'" class="relative">
      <UButton
        v-if="sourceText"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        :label="copied ? 'Copied' : 'Copy code'"
        color="neutral"
        variant="outline"
        size="md"
        :ui="{ leadingIcon: 'text-neutral size-3.5' }"
        class="absolute top-2 right-2 z-10"
        @click="copy(sourceText)"
      />

      <div
        ref="code"
        tabindex="0"
        aria-label="Code"
        class="overflow-auto rounded-md border border-muted bg-muted focus-visible:outline-2 focus-visible:outline-primary [&_pre]:my-0! [&_pre]:rounded-none! [&_pre]:border-0! [&_div.my-5]:my-0! [&_button]:hidden!"
        :class="sizeClass"
        :style="sizeStyle"
        @keydown="onCodeKeydown"
      >
        <MDCRenderer
          v-if="ast"
          :body="(ast as any).body"
          :data="(ast as any).data"
        />
      </div>
    </div>
  </div>
</template>
