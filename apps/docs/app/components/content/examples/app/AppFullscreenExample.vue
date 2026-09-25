<script setup lang="ts">
import { defineComponent, h, ref } from "vue";
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtSwitch from "@shopware-ag/meteor-component-library/MtSwitch";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import { useMtAppRegions } from "@shopware-ag/meteor-component-library";

const FullscreenView = defineComponent({
  setup() {
    const fullscreen = ref(false);

    useMtAppRegions(() => ({
      header: !fullscreen.value,
      sidebarStart: !fullscreen.value,
      sidebarEnd: !fullscreen.value,
    }));

    return () =>
      h(MtSwitch, {
        label: "Fullscreen view",
        modelValue: fullscreen.value,
        "onUpdate:modelValue": (value: boolean) => {
          fullscreen.value = value;
        },
      });
  },
});
</script>

<template>
  <mt-app class="app-fullscreen" :mobile-breakpoint="0">
    <template #header>
      <div class="slot slot--header">
        <mt-text size="xs" color="color-text-secondary-default">header</mt-text>
      </div>
    </template>

    <template #sidebar-start>
      <div class="slot slot--sidebar">
        <mt-text size="xs" color="color-text-secondary-default">
          sidebar-start
        </mt-text>
      </div>
    </template>

    <template #content>
      <div class="slot slot--content">
        <mt-text size="xs" color="color-text-secondary-default">content</mt-text>
        <fullscreen-view />
      </div>
    </template>

    <template #sidebar-end>
      <div class="slot slot--sidebar">
        <mt-text size="xs" color="color-text-secondary-default">
          sidebar-end
        </mt-text>
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-fullscreen {
  --mt-app-height: 280px;

  border-radius: var(--border-radius-m);
}

.slot {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  height: 100%;
  background-color: var(--color-background-secondary-default);
  border: 1px dashed var(--color-border-primary-default);
  border-radius: var(--border-radius-m);
}

.slot--header {
  height: var(--scale-size-56);
  margin: var(--scale-size-8);
}

.slot--sidebar {
  width: var(--scale-size-160);
}

.slot--content {
  place-content: center;
  gap: var(--scale-size-16);
  min-height: calc(100% - var(--scale-size-32));
  margin: var(--scale-size-16);
}
</style>
