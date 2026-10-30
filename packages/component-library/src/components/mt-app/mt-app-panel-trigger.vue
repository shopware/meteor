<template>
  <div v-if="trigger" class="mt-app-panel-trigger" :class="`mt-app-panel-trigger--${panel}`">
    <mt-divider
      v-if="panel === 'sidebar'"
      class="mt-app-panel-trigger__divider"
      orientation="vertical"
      decorative
    />

    <mt-button
      class="mt-app-panel-trigger__button"
      variant="tertiary"
      size="default"
      square
      :aria-label="trigger.label"
      :aria-expanded="trigger.expanded ? 'true' : 'false'"
      :aria-controls="trigger.controls"
      @click="trigger.toggle"
    >
      <mt-icon :name="trigger.icon" size="var(--scale-size-16)" decorative />
    </mt-button>

    <mt-divider
      v-if="panel === 'navigation'"
      class="mt-app-panel-trigger__divider"
      orientation="vertical"
      decorative
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onScopeDispose,
} from "vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtDivider from "@/components/mt-divider/mt-divider.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import { appContextKey } from "./composables/useAppContext";
import type { MtAppPanel } from "./composables/useApp";

/**
 * The trigger of a panel of the surrounding `<mt-app>`, for the header of a page: the navigation
 * trigger goes at the very start, the sidebar trigger at the very end, each separated from the
 * rest of the header by a divider. `mt-page` shows both on its own; use this in custom pages.
 *
 * - It opens the panel's drawer in the mobile layout, and shows and hides a panel that is closable
 *   in the desktop layout. Otherwise, and while a view hides the panel, it renders nothing.
 * - While it is mounted, the shell's header doesn't show its own trigger for the panel.
 * - Outside of a shell, it renders nothing.
 *
 * @experimental The API may still change in a future release.
 */
const props = defineProps<{
  /** The panel that the trigger opens. */
  panel: MtAppPanel;
}>();

const app = inject(appContextKey, null);

const trigger = computed(() => {
  if (!app?.isTriggerShown(props.panel)) return null;

  const panel = props.panel;

  return {
    label: app.triggerLabel(panel),
    icon: app.triggerIcon(panel),
    expanded: app.isOpen(panel),
    controls: app.triggerControls(panel),
    toggle: () => app.toggle(panel),
  };
});

if (app) {
  const register = () => app.registerTrigger(props.panel);
  let release: (() => void) | undefined = register();

  // A page that <KeepAlive> caches gives the trigger back to the shell while it isn't shown.
  if (getCurrentInstance()) {
    onDeactivated(() => {
      release?.();
      release = undefined;
    });
    onActivated(() => {
      release ??= register();
    });
  }

  onScopeDispose(() => release?.());
}
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
