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
  <mt-app
    class="app-fullscreen"
    :mobile-breakpoint="0"
    :apply-theme="false"
    :lock-document="false"
  >
    <template #header>
      <div class="app-fullscreen__region">
        <mt-text as="span" size="xs" weight="semibold">Header</mt-text>
      </div>
    </template>

    <template #sidebar-start>
      <div class="app-fullscreen__region app-fullscreen__sidebar">
        <mt-text as="span" size="xs" weight="semibold">Navigation</mt-text>
      </div>
    </template>

    <template #content>
      <div class="app-fullscreen__region">
        <fullscreen-view />
      </div>
    </template>

    <template #sidebar-end>
      <div class="app-fullscreen__region app-fullscreen__sidebar">
        <mt-text as="span" size="xs" weight="semibold">Assistant</mt-text>
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-fullscreen {
  --mt-app-height: 280px;

  border-radius: var(--border-radius-m);
}

.app-fullscreen__region {
  padding: var(--scale-size-16);
}

.app-fullscreen__sidebar {
  width: var(--scale-size-160);
}
</style>
