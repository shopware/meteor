<template>
  <Suspense>
    <Markdown
      :key="allowedImagePrefixes.join()"
      v-bind="$attrs"
      class="mt-markdown mt-prose"
      :value="content"
      :streaming="streaming"
      :options="options"
      :plugins="plugins"
      :components="components"
    />
  </Suspense>
</template>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from "vue";
import { Markdown } from "@comark/vue";
import security from "@comark/vue/plugins/security";
import taskList from "@comark/vue/plugins/task-list";
import MtCodeBlock from "@/components/_internal/mt-code-block.vue";

/**
 * Renders Markdown, such as the answer of an AI model, with Meteor's typography. It supports
 * GitHub Flavored Markdown and keeps up with text that is still streaming. Raw HTML is shown as
 * text, links only use safe schemes and images only load from allowed addresses.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The Markdown, including tables, task lists and strikethrough. */
    content: string;
    /**
     * Whether the content is still arriving. Unfinished syntax at the end, such as `**bold`,
     * renders as if it were complete.
     */
    streaming?: boolean;
    /**
     * The https addresses that images may load from, such as `https://cdn.example.com/media/`.
     * No image with an absolute address loads by default, because the address of an image in a
     * model's answer can carry data out of the conversation.
     */
    allowedImagePrefixes?: string[];
  }>(),
  {
    streaming: false,
    allowedImagePrefixes: () => [],
  },
);

defineOptions({ inheritAttrs: false });

// Raw HTML and Comark's own syntax stay off, so the content can't create elements or components,
// and headings get no ids, which could collide with the page's.
const options = { registerDefaultPlugins: false, headingIds: false };

const plugins = computed(() => [
  taskList(),
  security({
    allowedProtocols: ["http", "https", "mailto", "tel"],
    allowedImagePrefixes: props.allowedImagePrefixes,
    allowDataImages: false,
  }),
]);

/** A wide table scrolls in its wrapper; a scrolling table itself loses its semantics in Safari. */
const MarkdownTable: FunctionalComponent = (_, { attrs, slots }) =>
  h("div", { class: "mt-markdown__table" }, h("table", attrs, slots.default?.()));

/** Links that leave the app open in a new tab, so they don't replace the conversation. */
const MarkdownLink: FunctionalComponent = (_, { attrs, slots }) =>
  h(
    "a",
    /^https?:\/\//i.test(String(attrs.href ?? ""))
      ? { ...attrs, target: "_blank", rel: "noopener noreferrer" }
      : attrs,
    slots.default?.(),
  );

const components = { pre: MtCodeBlock, table: MarkdownTable, a: MarkdownLink };
</script>

<style src="./prose.css"></style>

<style>
/* The wrappers of tables and code blocks take the block spacing of the element inside them. */
.mt-markdown .mt-markdown__table,
.mt-markdown .mt-code-block {
  margin-block: 0 var(--scale-size-12);
}

.mt-markdown .mt-markdown__table:last-child,
.mt-markdown .mt-code-block:last-child {
  margin-block-end: 0;
}

.mt-markdown .mt-markdown__table > table {
  margin: 0;
}

.mt-markdown__table {
  overflow-x: auto;
}
</style>
