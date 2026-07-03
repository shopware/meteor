<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  command: string;
}>();

const { copy, isSupported } = useClipboard();

// Optimistic feedback: morph the icon the instant the button is pressed rather
// than waiting on the clipboard write to resolve (which can stall when the
// document isn't focused). The write is fired alongside it.
const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

function onCopy() {
  copy(props.command);
  copied.value = true;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => (copied.value = false), 2000);
}

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <div
    class="copy-cmd flex items-center gap-3 rounded-2xl border border-default bg-default py-2.5 pr-2.5 pl-4"
  >
    <span aria-hidden="true" class="font-mono text-sm text-dimmed select-none"
      >$</span
    >
    <code
      class="min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-highlighted"
    >
      {{ command }}
    </code>
    <!-- Client-only: useClipboard's `isSupported` differs between server and
         client, so rendering the button on the server causes a hydration
         mismatch. The command text above stays in the SSR HTML. -->
    <ClientOnly>
      <button
        v-if="isSupported"
        type="button"
        class="copy-btn relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-default bg-default text-muted transition-colors hover:text-highlighted"
        :aria-label="copied ? 'Copied' : 'Copy install command'"
        @click="onCopy"
      >
        <!-- Icon morphs copy -> check on success (state feedback). -->
        <UIcon
          name="i-lucide-copy"
          class="copy-icon absolute size-4"
          :class="copied ? 'is-hidden' : ''"
        />
        <UIcon
          name="i-lucide-check"
          class="copy-icon absolute size-4 text-success"
          :class="copied ? '' : 'is-hidden'"
        />
      </button>
    </ClientOnly>
  </div>
</template>

<style scoped>
.copy-cmd {
  /* Shared landing elevation (defined on .landing) so it matches the accordion
   * and slider cards in both themes. */
  box-shadow: var(--landing-elev);
}
.copy-btn {
  transition:
    color 0.15s ease,
    transform 0.14s var(--ease-out);
}
.copy-btn:active {
  transform: scale(0.94);
}

/* Cross-fade the two glyphs so the swap reads as one morph, not a pop. */
.copy-icon {
  transition:
    opacity 0.18s ease,
    transform 0.18s var(--ease-out),
    filter 0.18s ease;
}
.copy-icon.is-hidden {
  opacity: 0;
  transform: scale(0.6);
  filter: blur(2px);
}

@media (prefers-reduced-motion: reduce) {
  .copy-btn:active {
    transform: none;
  }
  .copy-icon {
    transition: opacity 0.12s ease;
  }
  .copy-icon.is-hidden {
    transform: none;
    filter: none;
  }
}
</style>
