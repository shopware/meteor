<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtPage, MtPanel, MtText } from "@shopware-ag/meteor-component-library";
import DocsTree from "../components/DocsTree.vue";
import { findPagePath } from "../data/pages";

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();

const breadcrumb = computed(() =>
  (findPagePath(props.id) ?? []).map((node) => ({ label: node.label })),
);
</script>

<template>
  <mt-page :breadcrumb="breadcrumb">
    <template #start>
      <mt-panel :label="t('nav.docs')" icon="regular-books" closable resizable>
        <DocsTree />
      </mt-panel>
    </template>

    <mt-text size="xs">{{ t("page.placeholder") }}</mt-text>
  </mt-page>
</template>
