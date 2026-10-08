<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtContainer,
  MtEmptyState,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <mt-container as="section" class="page stack">
    <mt-empty-state
      icon="regular-map"
      :headline="t('notFound.title')"
      :description="t('notFound.description')"
    >
      <template #button>
        <mt-button variant="primary" @click="router.push('/')">
          {{ t("notFound.home") }}
        </mt-button>
      </template>
    </mt-empty-state>
  </mt-container>
</template>
