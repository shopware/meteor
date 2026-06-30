<script setup lang="ts">
import { ref } from "vue";
import MtFloatingUi from "@shopware-ag/meteor-component-library/MtFloatingUi";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";

const anchors = ["Anchor 1", "Anchor 2", "Anchor 3"];

const isOpened = ref(false);
const anchorElement = ref<HTMLElement | null>(null);
const activeAnchor = ref("");
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function openFor(event: MouseEvent, anchor: string) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  anchorElement.value = event.currentTarget as HTMLElement;
  activeAnchor.value = anchor;
  isOpened.value = true;
}

function scheduleClose() {
  closeTimer = setTimeout(() => {
    isOpened.value = false;
  }, 200);
}

function cancelClose() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}
</script>

<template>
  <div class="anchors">
    <div
      v-for="anchor in anchors"
      :key="anchor"
      @mouseenter="openFor($event, anchor)"
      @mouseleave="scheduleClose"
    >
      <mt-button variant="secondary">{{ anchor }}</mt-button>
    </div>
  </div>

  <mt-floating-ui
    :is-opened="isOpened"
    :anchor-element="anchorElement"
    :floating-ui-options="{ placement: 'bottom' }"
    detached
    @close="isOpened = false"
  >
    <div
      class="floating-surface"
      @mouseenter="cancelClose"
      @mouseleave="scheduleClose"
    >
      <strong>{{ activeAnchor }}</strong>
      <p class="floating-surface__text">
        One shared floating surface, repositioned to the hovered anchor.
      </p>
    </div>
  </mt-floating-ui>
</template>

<style scoped>
.anchors {
  display: flex;
  gap: 12px;
}

.floating-surface {
  width: 280px;
  padding: 16px;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-raised);
  box-shadow: 0 6px 24px -8px rgba(16, 16, 19, 0.1);
}

.floating-surface__text {
  margin-top: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary-default);
}
</style>
