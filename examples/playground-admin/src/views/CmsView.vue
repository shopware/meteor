<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtPage, MtText } from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

const { t } = useI18n();
const breadcrumb = useBreadcrumb(() => t("cms.title"));

const blocks = Array.from({ length: 40 }, (_, index) => index + 1);
</script>

<template>
  <mt-page
    :breadcrumb="breadcrumb"
    :start-label="t('cms.blocks')"
    :end-label="t('cms.properties')"
    closable
  >
    <template #start>
      <aside :aria-label="t('cms.blocks')">
        <ul class="cms-blocks">
          <li v-for="block in blocks" :key="block">
            <mt-text size="xs">{{ t("cms.block", { number: block }) }}</mt-text>
          </li>
        </ul>
      </aside>
    </template>

    <div class="cms-canvas">
      <mt-text size="xs" color="color-text-secondary-default">
        {{ t("cms.canvas") }}
      </mt-text>
    </div>

    <template #end>
      <aside class="cms-properties" :aria-label="t('cms.properties')">
        <mt-text size="xs" color="color-text-secondary-default">
          {{ t("cms.noSelection") }}
        </mt-text>
      </aside>
    </template>
  </mt-page>
</template>

<style scoped>
.cms-blocks {
  display: grid;
  gap: var(--scale-size-8);
  width: 15rem;
  padding: var(--scale-size-16);
}

.cms-canvas {
  display: grid;
  place-items: center;
  min-height: 100%;
}

.cms-properties {
  width: 20rem;
  padding: var(--scale-size-16);
}
</style>
