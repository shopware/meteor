<template>
  <mt-panel-trigger-button
    v-if="app"
    ref="button"
    class="mt-app-panel-trigger"
    :label="trigger.label"
    :icon="trigger.icon"
    :expanded="app.isOpen(panel)"
    :controls="trigger.controls"
    @click="app.toggle(panel)"
  />
</template>

<script setup lang="ts">
import { computed, inject, useTemplateRef } from "vue";
import MtPanelTriggerButton from "@/components/_internal/mt-panel-region/mt-panel-trigger-button.vue";
import {
  appContextKey,
  appTriggerRegionKey,
  useAppRegistration,
  type AppPanelTrigger,
} from "./_internal/mt-app-context";
import type { MtAppPanel } from "./composables/useApp";

/**
 * A button that shows and hides a panel of the surrounding `mt-app`, for placing the trigger
 * yourself, for example in a custom header. It always shows inside `mt-app`, as often as it is
 * placed, and renders only the button. While it is placed, `mt-page` and `mt-app-header` leave out
 * their own trigger for the panel.
 *
 * @experimental The API may still change in a future release.
 */
const props = defineProps<{
  /** The panel that the trigger shows and hides. */
  panel: MtAppPanel;
}>();

const app = inject(appContextKey, null);
const region = inject(appTriggerRegionKey, "page");
const button = useTemplateRef<{ $el: HTMLElement }>("button");

const trigger = computed<AppPanelTrigger>(
  () => app?.triggerOf(props.panel) ?? { label: "", icon: "", controls: "" },
);

// A view that leaves with a transition keeps the trigger until the transition ends, so the shell's
// components don't show theirs in the meantime.
useAppRegistration((app) => {
  const release = app.registerPlacedTrigger(() => props.panel, region);

  return () => releaseWhenDetached(button.value?.$el ?? null, release);
});

/** Calls `release` once the element has left the page, right away when it isn't in it. */
function releaseWhenDetached(element: HTMLElement | null, release: () => void) {
  if (!element?.isConnected) {
    release();
    return;
  }

  const observer = new MutationObserver(() => {
    if (element.isConnected) return;

    observer.disconnect();
    release();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
</script>
