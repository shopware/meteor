<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtRadioGroupRoot from "@shopware-ag/meteor-component-library/MtRadioGroupRoot";
import MtRadioGroupCustomItem from "@shopware-ag/meteor-component-library/MtRadioGroupCustomItem";
import MtRadioGroupIndicator from "@shopware-ag/meteor-component-library/MtRadioGroupIndicator";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtColorpicker from "@shopware-ag/meteor-component-library/MtColorpicker";

const selectedLayout = ref("grid");
const layouts = [
  {
    value: "grid",
    name: "Grid layout",
    icon: "regular-view-grid",
    desc: "Show products as cards in a grid, ideal for catalogs.",
  },
  {
    value: "list",
    name: "List layout",
    icon: "regular-view-normal",
    desc: "Show products as compact rows with details, ideal for catalogs.",
  },
];
const brandColor = ref("#189eff");
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card title="Appearance">
    <div class="section">
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
                    <mt-icon :name="l.icon" size="16" />
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
      <mt-colorpicker v-model="brandColor" label="Brand color" />
    </div>
  </mt-card>
</template>

<style scoped>
/* A titled section: a 16px-gap column holding the labelled radio group and the
   colorpicker. */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
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
  border-radius: var(--border-radius-s);
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
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-border-primary-default);
  background: var(--color-background-secondary-default);
  flex-shrink: 0;
}
/* The radio-group root carries a default bottom margin that ignores the
   removeDefaultMargin flag; zero it so the section flex-gap is the only spacing. */
:deep(.mt-radio-group-root) {
  margin-bottom: 0;
}
/* The group's built-in label sits only 2px above the options; give it 8px. */
:deep(.mt-radio-group-root__label) {
  margin-bottom: var(--scale-size-8);
}
/* MtColorpicker's popover carries both .mt-floating-ui (position: relative) and
   .mt-colorpicker__colorpicker-position (position: absolute); source order lets
   the former win, dropping the closed popover in-flow. Restore absolute. */
:deep(.mt-colorpicker__colorpicker-position) {
  position: absolute;
}
</style>
