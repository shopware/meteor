<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtPage, MtPanel, MtText } from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

const { t } = useI18n();
const breadcrumb = useBreadcrumb(() => t("cms.title"));

const blocks = Array.from({ length: 40 }, (_, index) => index + 1);
</script>

<template>
  <mt-page :breadcrumb="breadcrumb" closable>
    <template #start>
      <mt-panel
        :label="t('cms.blocks')"
        icon="regular-layout"
        closable
        resizable
        :width="240"
        :min-width="200"
        :max-width="400"
      >
        <aside :aria-label="t('cms.blocks')">
          <ul class="cms-blocks">
            <li v-for="block in blocks" :key="block">
              <mt-text size="xs">{{
                t("cms.block", { number: block })
              }}</mt-text>
            </li>
          </ul>
        </aside>
      </mt-panel>
    </template>

    <div class="cms-canvas">
      <mt-text size="xs" color="color-text-secondary-default">
        {{ t("cms.canvas") }}
      </mt-text>
    </div>

    <template #end>
      <mt-panel
        :label="t('cms.properties')"
        icon="regular-cog"
        closable
        resizable
        :width="320"
        :min-width="240"
        :max-width="480"
      >
        <aside class="cms-properties" :aria-label="t('cms.properties')">
          <mt-text size="xs" color="color-text-secondary-default">
            {{ t("cms.noSelection") }}
          </mt-text>
        </aside>
      </mt-panel>
    </template>
  </mt-page>
</template>

<style scoped>
.cms-blocks {
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
}

.cms-canvas {
  display: grid;
  place-items: center;
  min-height: 100%;
}

.cms-properties {
  padding: var(--scale-size-16);
}
</style>
