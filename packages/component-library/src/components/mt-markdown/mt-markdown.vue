<template>
  <div class="mt-markdown mt-prose">
    <mt-markdown-block
      v-for="(token, index) in parsed.tokens"
      :key="index"
      :token="token"
      :image-prefixes="imagePrefixes"
      :incomplete="streaming && index === parsed.tokens.length - 1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Lexer, type Token } from "marked";
import remend from "remend";
import MtMarkdownBlock from "./_internal/mt-markdown-block";
import { normalizeImagePrefix } from "./_internal/safe-url";
import { stableTail } from "./_internal/stable-tail";

/**
 * Renders Markdown, such as the answer of an AI model, with Meteor's typography. It supports
 * GitHub Flavored Markdown and keeps up with text that is still streaming. Raw HTML is shown as
 * text, links only use safe schemes and images only load from allowed addresses.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The Markdown, including tables, task lists, strikethrough and autolinks. */
    content: string;
    /**
     * Whether the content is still arriving. Only what already renders as in the finished text
     * shows: syntax without content yet, such as `**` or `##`, waits for it, a table appears with
     * its header and first row and then row by row, and unfinished emphasis such as `**bold`
     * renders as if it were complete. A code block that is still being written has no copy button
     * yet.
     */
    streaming?: boolean;
    /**
     * The https addresses that images may load from, such as `https://cdn.example.com/media/`.
     * Other images show as a link. No image loads by default, because the address of an image in
     * a model's answer can carry data out of the conversation.
     */
    allowedImagePrefixes?: string[];
  }>(),
  {
    streaming: false,
    allowedImagePrefixes: () => [],
  },
);

interface ParsedMarkdown {
  /** The link reference definitions, which can change how earlier blocks render. */
  links: string;
  tokens: Token[];
}

const parsed = computed<ParsedMarkdown>((previous) => {
  // While streaming, only the part that renders as it will in the finished text, repaired by
  // `remend`, so no Markdown ever shows unrendered or half rendered.
  const text = props.streaming ? remend(stableTail(props.content)) : props.content;
  // A new lexer each time: `lex()` adds to the tokens of earlier calls.
  const lexed = new Lexer({ gfm: true }).lex(text);
  const links = JSON.stringify(lexed.links);

  // Unchanged blocks keep their token object, so their components don't render again.
  const reusable = previous?.links === links ? previous.tokens : [];
  const tokens = lexed
    .filter((token) => token.type !== "space" && token.type !== "def")
    .map((token, index) => (reusable[index]?.raw === token.raw ? reusable[index] : token));

  return { links, tokens };
});

// Kept as the same array while the prefixes are the same, even if a new array is passed.
const imagePrefixes = computed<string[]>((previous) => {
  const next = props.allowedImagePrefixes
    .map(normalizeImagePrefix)
    .filter((prefix): prefix is string => prefix !== undefined);

  return previous?.join("\n") === next.join("\n") ? previous : next;
});
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
