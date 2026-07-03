<script setup lang="ts">
import MtRadioGroupRoot from "@shopware-ag/meteor-component-library/MtRadioGroupRoot";
import MtRadioGroupCustomItem from "@shopware-ag/meteor-component-library/MtRadioGroupCustomItem";
import MtRadioGroupIndicator from "@shopware-ag/meteor-component-library/MtRadioGroupIndicator";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const selectedLayout = ref("grid");
const layouts = [
  {
    value: "grid",
    name: "Grid layout",
    icon: "regular-view-grid",
    desc: "Show products as cards in a grid.",
  },
  {
    value: "list",
    name: "List layout",
    icon: "regular-view-normal",
    desc: "Show products as compact rows.",
  },
];
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-radio-group-root v-model="selectedLayout" label="Layout style">
    <template #default="{ disabled, identification }">
      <div class="stack-sm">
        <mt-radio-group-custom-item
          v-for="l in layouts"
          :key="l.value"
          :value="l.value"
        >
          <div
            class="pick pick--layout"
            :class="{ 'pick--on': selectedLayout === l.value }"
          >
            <div class="flex min-w-0 items-start gap-4">
              <div class="layout-tile">
                <mt-icon :name="l.icon" size="14" />
              </div>
              <div class="min-w-0">
                <mt-text size="xs" weight="semibold">{{ l.name }}</mt-text>
                <mt-text size="xs" :color="muted">{{ l.desc }}</mt-text>
              </div>
            </div>
            <div class="pick-radio">
              <mt-radio-group-indicator
                :id="`layout-${l.value}`"
                :name="identification"
                :value="l.value"
                :checked="selectedLayout === l.value"
                :disabled="disabled"
              />
            </div>
          </div>
        </mt-radio-group-custom-item>
      </div>
    </template>
  </mt-radio-group-root>
</template>

<style scoped>
.stack-sm {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}
/* Selectable option rows: bordered highlighting with the brand colour when
   active — driven by tokens, so it tracks light/dark automatically. */
.pick {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  justify-content: space-between;
  padding: var(--scale-size-12);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
  background-color: var(--color-elevation-surface-raised);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}
.pick--on {
  border-color: var(--color-interaction-primary-default);
  background: color-mix(
    in srgb,
    var(--color-interaction-primary-default) 7%,
    transparent
  );
}
/* Top-align the content and use roomier 16px padding/gap. */
.pick--layout {
  align-items: flex-start;
  padding: var(--scale-size-16);
  gap: var(--scale-size-16);
}
/* The indicator's control is display: inline-flex, so on its own it rides the
   text baseline and gets squeezed by long text; a flex box block-ifies it and
   pins it, unshrunk, to the top-right. */
.pick-radio {
  display: flex;
  flex-shrink: 0;
  align-self: flex-start;
}
/* Bordered, squared 40×40 icon tile. */
.layout-tile {
  display: grid;
  place-items: center;
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-border-primary-default);
  background: var(--color-background-secondary-default);
  flex-shrink: 0;
}
/* The radio-group root (this component's root element) carries a default bottom
   margin that ignores the removeDefaultMargin flag; zero it so the option
   spacing is the only gap. Targeted without :deep() so it matches the scoped
   root itself (a descendant :deep() selector would never match it). */
.mt-radio-group-root {
  margin-bottom: 0;
}
/* Keep the label for assistive tech but hide it visually (position: absolute
   also drops its grid row, so the options sit flush at the top). */
:deep(.mt-radio-group-root__label) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
