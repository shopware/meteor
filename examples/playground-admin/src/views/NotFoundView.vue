<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtEmptyState,
  MtPage,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb(() => t("notFound.title"));
</script>

<template>
  <mt-page width="m" :breadcrumb="breadcrumb">
    <mt-empty-state
      icon="regular-map"
      :headline="t('notFound.title')"
      :description="t('notFound.description')"
    >
      <template #button>
        <mt-button
          variant="secondary"
          size="default"
          @click="router.push({ name: 'dashboard' })"
        >
          {{ t("notFound.home") }}
        </mt-button>
      </template>
    </mt-empty-state>
  </mt-page>
</template>
