<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtButton,
  MtCollapsible,
  MtCollapsibleContent,
  MtCollapsibleTrigger,
  MtColorpicker,
  MtIcon,
  MtNumberField,
  MtPage,
  MtPanel,
  MtSwitch,
  MtTabs,
  MtText,
  MtTooltip,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

// The shell as a full-screen route shows it. In your application, keep the shell with its
// navigation in the root component and hide its regions in the meta of the route.
const breadcrumb: BreadcrumbItem[] = [
  { label: "Shopping Experiences", to: "/shopping-experiences", icon: "image-text" },
  { label: "Homepage" },
];

interface Layer {
  id: string;
  name: string;
  icon: string;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

// Sample data. Replace it with the layers of the layout your page loads.
const layers = ref<Layer[]>([
  { id: "hero", name: "Hero", icon: "regular-layout", depth: 0, x: 0, y: 0, width: 1440, height: 640, fill: "#0870ff" },
  { id: "headline", name: "Headline", icon: "regular-style-xs", depth: 1, x: 120, y: 200, width: 720, height: 96, fill: "#ffffff" },
  { id: "cta", name: "Shop now button", icon: "regular-square", depth: 1, x: 120, y: 344, width: 200, height: 48, fill: "#ffffff" },
  { id: "products", name: "Product slider", icon: "regular-products", depth: 0, x: 0, y: 640, width: 1440, height: 520, fill: "#f9fafb" },
  { id: "newsletter", name: "Newsletter", icon: "regular-envelope", depth: 0, x: 0, y: 1160, width: 1440, height: 320, fill: "#e6f0ff" },
]);

const selectedId = ref("headline");
const layer = computed(() => layers.value.find(({ id }) => id === selectedId.value)!);

const tab = ref("design");
const tabs = [
  { name: "design", label: "Design" },
  { name: "prototype", label: "Prototype" },
];

const showStroke = ref(false);
const strokeColor = ref("#1e1e24");
const strokeWidth = ref(1);

const tools = [
  { name: "move", label: "Move", icon: "regular-location-arrow" },
  { name: "frame", label: "Frame", icon: "regular-crop" },
  { name: "text", label: "Text", icon: "regular-style-xs" },
  { name: "comment", label: "Comment", icon: "regular-comment" },
];
const activeTool = ref("move");

const { addSnackbar } = useSnackbar();
</script>

<template>
  <mt-app>
    <mt-page :breadcrumb="breadcrumb" closable inset>
      <template #actions>
        <mt-button variant="secondary" size="default" @click="addSnackbar({ message: 'Preview would open' })">
          <template #iconFront>
            <mt-icon name="regular-play" size="var(--scale-size-16)" decorative />
          </template>
          Preview
        </mt-button>
        <mt-button variant="primary" size="default" @click="addSnackbar({ message: 'Layout published' })">
          Publish
        </mt-button>
      </template>

      <template #start>
        <mt-panel label="Layers" icon="regular-layer-group" closable resizable>
          <aside class="panel" aria-label="Layers">
            <missing-feature title="Selectable tree">
              Nav is for pages, not for picking items. A tree that selects, nests and reorders
              layers is missing. The list stands in for it.

              <template #stand-in>
                <ul class="layers" role="listbox" aria-label="Layers">
                  <li
                    v-for="item in layers"
                    :key="item.id"
                    role="option"
                    :aria-selected="item.id === selectedId"
                    tabindex="0"
                    class="layers__item"
                    :class="{ 'layers__item--selected': item.id === selectedId }"
                    :style="{ paddingInlineStart: `calc(var(--scale-size-8) + ${item.depth} * var(--scale-size-16))` }"
                    @click="selectedId = item.id"
                    @keydown.enter.prevent="selectedId = item.id"
                  >
                    <mt-icon :name="item.icon" size="var(--scale-size-12)" decorative />
                    <mt-text size="xs" as="span">{{ item.name }}</mt-text>
                  </li>
                </ul>
              </template>
            </missing-feature>
          </aside>
        </mt-panel>
      </template>

      <div class="canvas">
        <missing-feature title="Floating panels" kind="prop" inline class="canvas__note">
          Panels sit next to the content and push it aside. Panels that float over a canvas are
          missing.
        </missing-feature>

        <placeholder-slot name="Canvas" />

        <missing-feature title="Floating toolbar" class="canvas__toolbar">
          No toolbar that floats over the content.

          <template #stand-in>
            <div class="tools" role="toolbar" aria-label="Tools">
              <mt-tooltip v-for="item in tools" :key="item.name" :content="item.label">
                <template #default="params">
                  <mt-button
                    v-bind="params"
                    :variant="activeTool === item.name ? 'secondary' : 'tertiary'"
                    size="default"
                    square
                    :aria-label="item.label"
                    :aria-pressed="activeTool === item.name"
                    @click="activeTool = item.name"
                  >
                    <template #iconFront>
                      <mt-icon :name="item.icon" size="var(--scale-size-16)" decorative />
                    </template>
                  </mt-button>
                </template>
              </mt-tooltip>
            </div>
          </template>
        </missing-feature>
      </div>

      <template #end>
        <mt-panel label="Properties" icon="regular-sliders-v" closable resizable>
          <aside class="panel" aria-label="Properties">
            <mt-text size="s" weight="semibold" as="h2">{{ layer.name }}</mt-text>

            <mt-tabs :items="tabs" :default-item="tab" @new-item-active="tab = $event" />

            <template v-if="tab === 'design'">
              <div class="pairs">
                <mt-number-field v-model="layer.x" label="X" number-type="int" />
                <mt-number-field v-model="layer.y" label="Y" number-type="int" />
                <mt-number-field v-model="layer.width" label="Width" number-type="int" :min="0" />
                <mt-number-field v-model="layer.height" label="Height" number-type="int" :min="0" />
              </div>

              <mt-collapsible default-open>
                <mt-collapsible-trigger as-child>
                  <mt-button variant="tertiary" size="small">
                    Fill
                    <template #iconBack>
                      <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" decorative />
                    </template>
                  </mt-button>
                </mt-collapsible-trigger>
                <mt-collapsible-content>
                  <mt-colorpicker v-model="layer.fill" label="Color" />
                </mt-collapsible-content>
              </mt-collapsible>

              <mt-collapsible>
                <mt-collapsible-trigger as-child>
                  <mt-button variant="tertiary" size="small">
                    Stroke
                    <template #iconBack>
                      <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" decorative />
                    </template>
                  </mt-button>
                </mt-collapsible-trigger>
                <mt-collapsible-content>
                  <div class="stack">
                    <mt-switch v-model="showStroke" label="Show stroke" />
                    <mt-colorpicker v-model="strokeColor" label="Color" :disabled="!showStroke" />
                    <mt-number-field
                      v-model="strokeWidth"
                      label="Width"
                      number-type="int"
                      :min="0"
                      :disabled="!showStroke"
                    />
                  </div>
                </mt-collapsible-content>
              </mt-collapsible>
            </template>

            <placeholder-slot v-else name="Interactions" style="height: 12rem" />
          </aside>
        </mt-panel>
      </template>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--scale-size-12);
}

.panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-12);
  align-content: start;
  padding: var(--scale-size-8);
}

.panel > h2 {
  margin: 0;
}

.layers {
  display: grid;
  gap: var(--scale-size-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.layers__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-height: var(--scale-size-32);
  padding-inline-end: var(--scale-size-8);
  color: var(--color-text-primary-default);
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.layers__item:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.layers__item:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(var(--scale-size-2) * -1);
}

.layers__item--selected {
  color: var(--color-text-brand-default);
  background-color: var(--color-background-brand-default);
}

.pairs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--scale-size-12);
}

.canvas {
  position: relative;
  display: grid;
  height: 100%;
  padding: var(--scale-size-16);
  background-color: var(--color-elevation-surface-sunken);
}

.canvas__note {
  position: absolute;
  inset-block-start: var(--scale-size-24);
  inset-inline-start: var(--scale-size-24);
  z-index: 1;
}

.canvas__toolbar {
  position: absolute;
  inset-block-end: var(--scale-size-24);
  inset-inline-start: 50%;
  translate: -50% 0;
  max-width: calc(100% - var(--scale-size-48));
}

.tools {
  display: flex;
  gap: var(--scale-size-4);
}
</style>
