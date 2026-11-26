<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtPage,
  MtPanel,
  MtSelect,
  MtText,
  MtTextField,
} from "@shopware-ag/meteor-component-library";
import { layouts } from "../cmsLayouts";
import { useBreadcrumb } from "../composables/useBreadcrumb";

const { t } = useI18n();
const route = useRoute();

const layout = computed(
  () => layouts.find((entry) => entry.id === route.params.id) ?? layouts[0],
);

const breadcrumb = useBreadcrumb(() => layout.value.name);

/** The block categories of the designer, each with its blocks. */
const blockCategories = [
  { key: "text", icon: "regular-align-left", blocks: 6 },
  { key: "image", icon: "regular-image", blocks: 8 },
  { key: "video", icon: "regular-video", blocks: 2 },
  { key: "textImage", icon: "regular-image-text", blocks: 6 },
  { key: "commerce", icon: "regular-shopping-bag", blocks: 5 },
  { key: "form", icon: "regular-file-edit", blocks: 2 },
  { key: "html", icon: "regular-code", blocks: 1 },
] as const;

const category = ref<(typeof blockCategories)[number]["key"]>("text");

const categoryOptions = computed(() =>
  blockCategories.map((entry) => ({
    value: entry.key,
    label: t(`cms.categories.${entry.key}`),
  })),
);

const blockCount = computed(
  () => blockCategories.find((entry) => entry.key === category.value)?.blocks ?? 0,
);

const device = ref<"mobile" | "tablet" | "desktop">("desktop");

/** The device preview of the canvas. */
const deviceActions = computed(() =>
  (
    [
      ["mobile", "regular-mobile"],
      ["tablet", "regular-tablet"],
      ["desktop", "regular-desktop"],
    ] as const
  ).map(([id, iconName]) => ({
    id,
    iconName,
    isPressed: device.value === id,
    onClick: () => (device.value = id),
  })),
);
const selected = ref<number | null>(1);

/** The sections of the canvas: a hero, a row of three, text and image, and a product slider. */
const sections = ["hero", "three", "textImage", "products"] as const;
</script>

<template>
  <mt-page :breadcrumb="breadcrumb" closable>
    <template #actions>
      <div class="cms-devices" role="group" :aria-label="t('cms.device')">
        <mt-button
          v-for="action in deviceActions"
          :key="action.id"
          :variant="action.isPressed ? 'primary' : 'secondary'"
          size="default"
          square
          :aria-label="t(`cms.devices.${action.id}`)"
          :aria-pressed="action.isPressed"
          @click="action.onClick"
        >
          <mt-icon :name="action.iconName" size="var(--scale-size-16)" decorative />
        </mt-button>
      </div>
      <mt-button variant="primary" size="default">
        {{ t("common.save") }}
      </mt-button>
    </template>

    <template #start>
      <mt-panel
        :label="t('cms.blocks')"
        icon="regular-layout"
        closable
        resizable
      >
        <aside class="cms-blocks" :aria-label="t('cms.blocks')">
          <mt-select
            v-model="category"
            :label="t('cms.blockCategory')"
            :options="categoryOptions"
            :enable-search="false"
            hide-clearable-button
          />
          <ul class="cms-blocks__list">
            <li v-for="block in blockCount" :key="block" class="cms-blocks__item">
              <span class="cms-blocks__preview" :class="`cms-blocks__preview--${block % 3}`">
                <span v-for="part in (block % 3) + 1" :key="part" />
              </span>
              <mt-text size="2xs" color="color-text-secondary-default">
                {{ t(`cms.categories.${category}`) }} {{ block }}
              </mt-text>
            </li>
          </ul>
        </aside>
      </mt-panel>
    </template>

    <div class="cms-canvas" :class="`cms-canvas--${device}`">
      <div class="cms-canvas__page">
        <section
          v-for="(section, index) in sections"
          :key="section"
          class="cms-canvas__section"
          :class="[
            `cms-canvas__section--${section}`,
            { 'is--selected': selected === index },
          ]"
          tabindex="0"
          @click="selected = index"
          @keydown.enter="selected = index"
        >
          <template v-if="section === 'hero'">
            <mt-icon name="regular-image" size="var(--scale-size-32)" decorative />
          </template>
          <template v-else-if="section === 'three'">
            <span v-for="column in 3" :key="column" />
          </template>
          <template v-else-if="section === 'textImage'">
            <span class="cms-canvas__text">
              <span v-for="line in 4" :key="line" />
            </span>
            <span class="cms-canvas__image" />
          </template>
          <template v-else>
            <span v-for="product in 4" :key="product" class="cms-canvas__product" />
          </template>
        </section>
      </div>
    </div>

    <template #end>
      <mt-panel :label="t('cms.properties')" icon="regular-cog" closable resizable>
        <aside class="cms-properties" :aria-label="t('cms.properties')">
          <template v-if="selected !== null">
            <mt-text size="s" weight="semibold">
              {{ t(`cms.sections.${sections[selected]}`) }}
            </mt-text>
            <mt-text-field :label="t('cms.fields.name')" :model-value="layout.name" />
            <mt-select
              model-value="boxed"
              :label="t('cms.fields.sizing')"
              :options="[
                { value: 'boxed', label: t('cms.sizing.boxed') },
                { value: 'full_width', label: t('cms.sizing.fullWidth') },
              ]"
              :enable-search="false"
              hide-clearable-button
            />
            <mt-text-field :label="t('cms.fields.marginTop')" model-value="20px" />
            <mt-text-field :label="t('cms.fields.marginBottom')" model-value="20px" />
          </template>
          <mt-text v-else size="xs" color="color-text-secondary-default">
            {{ t("cms.noSelection") }}
          </mt-text>
        </aside>
      </mt-panel>
    </template>
  </mt-page>
</template>

<style scoped>
.cms-devices {
  display: flex;
  gap: var(--scale-size-4);
}

.cms-blocks {
  display: grid;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
}

.cms-blocks__list {
  display: grid;
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.cms-blocks__item {
  display: grid;
  gap: var(--scale-size-4);
}

.cms-blocks__preview {
  display: grid;
  grid-auto-flow: column;
  gap: var(--scale-size-4);
  height: var(--scale-size-64);
  padding: var(--scale-size-8);
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
  cursor: grab;
}

.cms-blocks__preview span {
  background-color: var(--color-elevation-surface-default);
  border-radius: var(--border-radius-2xs);
}

.cms-canvas {
  min-height: 100%;
  padding: var(--scale-size-8);
}

.cms-canvas__page {
  display: grid;
  gap: var(--scale-size-24);
  max-width: 64rem;
  margin-inline: auto;
  transition: max-width 0.2s ease;
}

.cms-canvas--tablet .cms-canvas__page {
  max-width: 48rem;
}

.cms-canvas--mobile .cms-canvas__page {
  max-width: 24rem;
}

.cms-canvas__section {
  display: grid;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
  border: 1px dashed var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.cms-canvas__section.is--selected,
.cms-canvas__section:focus-visible {
  outline: none;
  border: 2px solid var(--color-border-brand-default);
}

.cms-canvas__section--hero {
  place-items: center;
  min-height: 14rem;
  color: var(--color-icon-secondary-default);
  background-color: var(--color-background-secondary-default);
}

.cms-canvas__section--three {
  grid-template-columns: repeat(3, 1fr);
}

.cms-canvas__section--three > span,
.cms-canvas__image,
.cms-canvas__product {
  min-height: 8rem;
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-xs);
}

.cms-canvas__section--textImage {
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.cms-canvas__text {
  display: grid;
  gap: var(--scale-size-8);
}

.cms-canvas__text span {
  height: var(--scale-size-10);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-2xs);
}

.cms-canvas__text span:first-child {
  width: 60%;
  height: var(--scale-size-20);
}

.cms-canvas__section--products {
  grid-template-columns: repeat(4, 1fr);
}

.cms-canvas--mobile .cms-canvas__section--three,
.cms-canvas--mobile .cms-canvas__section--textImage,
.cms-canvas--mobile .cms-canvas__section--products {
  grid-template-columns: 1fr;
}

.cms-properties {
  display: grid;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
}
</style>
