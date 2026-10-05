<template>
  <mt-collapsible v-model:open="open" class="mt-reasoning">
    <slot />
  </mt-collapsible>
</template>

<script setup lang="ts">
import { onMounted, provide, toRef, watch } from "vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import { reasoningContextKey } from "./reasoning-context";

/**
 * The reasoning of an AI answer, collapsed behind "Thought for N seconds" until the user opens it,
 * so streaming text doesn't shift the conversation. It measures how long the model reasons. Bind
 * the `text` of an AI SDK reasoning part to `mt-reasoning-content`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** Whether the model is still reasoning, for example while the part's `state` is `streaming`. */
    streaming?: boolean;
    /**
     * Opens it while the model reasons and closes it again a second after, once. Without it, it
     * stays closed until the user opens it.
     */
    defaultOpen?: boolean;
  }>(),
  {
    streaming: false,
    defaultOpen: false,
  },
);

/** Whether the reasoning is open. */
const open = defineModel<boolean>("open", { default: undefined });

/** How long the model reasoned, in seconds. Measured while `streaming` unless it is set. */
const duration = defineModel<number>("duration", { default: undefined });

defineSlots<{
  /** `mt-reasoning-trigger` and `mt-reasoning-content`. */
  default?(): unknown;
}>();

if (open.value === undefined) open.value = props.defaultOpen && props.streaming;

provide(reasoningContextKey, { streaming: toRef(props, "streaming"), duration });

/** How long after the reasoning ends it closes again. */
const AUTO_CLOSE_DELAY = 1000;

let startedAt: number | undefined;
let hasStreamed = false;
let hasAutoClosed = false;

// Timing only starts in the browser, so a server render matches the first render in the browser.
onMounted(() => {
  watch(
    () => props.streaming,
    (streaming) => {
      if (streaming) {
        hasStreamed = true;
        if (props.defaultOpen) open.value = true;
        if (startedAt === undefined && duration.value === undefined) startedAt = Date.now();
      } else if (startedAt !== undefined) {
        duration.value = Math.ceil((Date.now() - startedAt) / 1000);
        startedAt = undefined;
      }
    },
    { immediate: true },
  );

  // With `defaultOpen`, it closes once after the reasoning streamed, unless it was closed by then.
  watch(
    [() => props.streaming, open],
    ([streaming, isOpen], _, onCleanup) => {
      if (!props.defaultOpen || streaming || !isOpen || !hasStreamed || hasAutoClosed) return;

      const timer = setTimeout(() => {
        open.value = false;
        hasAutoClosed = true;
      }, AUTO_CLOSE_DELAY);
      onCleanup(() => clearTimeout(timer));
    },
    { immediate: true },
  );
});
</script>
