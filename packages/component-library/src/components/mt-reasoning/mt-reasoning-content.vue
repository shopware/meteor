<template>
  <mt-collapsible-content class="mt-reasoning-content">
    <div class="mt-reasoning-content__inner">
      <slot>
        <mt-markdown :content="content ?? ''" :streaming="streaming" />
      </slot>
    </div>
  </mt-collapsible-content>
</template>

<script setup lang="ts">
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import MtMarkdown from "@/components/mt-markdown/mt-markdown.vue";
import { useReasoningContext } from "./reasoning-context";

/**
 * The reasoning text of `mt-reasoning`, rendered as Markdown while it streams.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The reasoning, such as the `text` of an AI SDK reasoning part. */
    content?: string;
  }>(),
  {
    content: undefined,
  },
);

defineSlots<{
  /** Custom content instead of the Markdown of `content`. */
  default?(): unknown;
}>();

const { streaming } = useReasoningContext("mt-reasoning-content");
</script>

<style>
.mt-reasoning-content__inner {
  padding-block-start: var(--scale-size-8);
  padding-inline-start: var(--scale-size-22);
}

/* Reasoning reads as secondary to the answer. */
.mt-reasoning-content .mt-prose {
  color: var(--color-text-secondary-default);
}
</style>
