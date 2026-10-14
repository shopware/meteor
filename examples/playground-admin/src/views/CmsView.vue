<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtPage,
  MtText,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb(() => t("cms.title"));

const blocks = Array.from({ length: 40 }, (_, index) => index + 1);

function goBack() {
  if (router.options.history.state.back) router.back();
  else router.push({ name: "dashboard" });
}
</script>

<template>
  <mt-page
    :breadcrumb="breadcrumb"
    :start-label="t('cms.blocks')"
    :end-label="t('cms.properties')"
  >
    <template #actions>
      <mt-button variant="secondary" size="default" @click="goBack">
        <template #iconFront="{ size }">
          <mt-icon name="regular-chevron-left-xs" :size="size" />
        </template>
        {{ t("cms.back") }}
      </mt-button>
    </template>

    <template #start>
      <ul class="cms-blocks">
        <li v-for="block in blocks" :key="block">
          <mt-text size="xs">{{ t("cms.block", { number: block }) }}</mt-text>
        </li>
      </ul>
    </template>

    <div class="cms-canvas">
      <mt-text size="xs" color="color-text-secondary-default">
        {{ t("cms.canvas") }}
      </mt-text>
    </div>

    <template #end>
      <div class="cms-properties">
        <mt-text size="xs" color="color-text-secondary-default">
          {{ t("cms.noSelection") }}
        </mt-text>
      </div>
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
