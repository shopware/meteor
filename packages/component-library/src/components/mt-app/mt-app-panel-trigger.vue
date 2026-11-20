<template>
  <div
    v-if="trigger"
    ref="root"
    class="mt-app-panel-trigger"
    :class="`mt-app-panel-trigger--${panel}`"
  >
    <mt-divider
      v-if="panel === 'sidebar'"
      class="mt-app-panel-trigger__divider"
      orientation="vertical"
      decorative
    />

    <mt-panel-trigger-button
      class="mt-app-panel-trigger__button"
      :label="trigger.label"
      :icon="trigger.icon"
      :expanded="app?.isOpen(panel) ?? false"
      :controls="trigger.controls"
      @click="app?.toggle(panel)"
    />

    <mt-divider
      v-if="panel === 'navigation'"
      class="mt-app-panel-trigger__divider"
      orientation="vertical"
      decorative
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, useTemplateRef } from "vue";
import MtDivider from "@/components/mt-divider/mt-divider.vue";
import MtPanelTriggerButton from "@/components/_internal/mt-panel-region/mt-panel-trigger-button.vue";
import { appContextKey, useAppRegistration } from "./_internal/mt-app-context";
import type { MtAppPanel } from "./composables/useApp";

/**
 * The trigger of a panel of the surrounding `mt-app` for the header of a custom page: the navigation
 * trigger at its very start, the sidebar trigger at its very end. `mt-page` shows both on its own.
 *
 * @experimental The API may still change in a future release.
 */
const props = defineProps<{
  /** The panel that the trigger shows and hides. */
  panel: MtAppPanel;
}>();

const app = inject(appContextKey, null);
const root = useTemplateRef<HTMLElement>("root");

const trigger = computed(() => app?.panelTrigger(props.panel));

/**
 * Gives the trigger back to the shell once its element has left the page. A page that leaves with
 * a transition still shows its trigger until the transition ends.
 */
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

useAppRegistration((app) => {
  const release = app.registerTrigger(() => props.panel);

  return () => releaseWhenDetached(root.value, release);
});
</script>

<style scoped>
.mt-app-panel-trigger {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-app-panel-trigger__divider {
  height: var(--scale-size-40);
}
</style>
