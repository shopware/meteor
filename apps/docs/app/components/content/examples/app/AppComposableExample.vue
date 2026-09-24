<script setup lang="ts">
import { defineComponent, h } from "vue";
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import { useMtApp } from "@shopware-ag/meteor-component-library";

const ShellState = defineComponent({
  setup() {
    const app = useMtApp();

    return () =>
      h(MtText, { size: "xs" }, () => [
        `Layout: ${app.isMobile.value ? "mobile" : "desktop"} · `,
        `Drawer: ${app.activeDrawer.value ?? "none"} · `,
        `Theme: ${app.theme.value} (${app.resolvedTheme.value})`,
      ]);
  },
});
</script>

<template>
  <mt-app
    class="app-composable"
    :mobile-breakpoint="0"
    :apply-theme="false"
    :lock-document="false"
  >
    <template #content>
      <div class="app-composable__content">
        <shell-state />
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-composable {
  --mt-app-height: 160px;

  border-radius: var(--border-radius-m);
}

.app-composable__content {
  padding: var(--scale-size-24);
}
</style>
