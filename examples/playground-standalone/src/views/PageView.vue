<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtPage, MtPanel, MtText } from "@shopware-ag/meteor-component-library";
import AppSkeleton from "../components/AppSkeleton.vue";
import DocsTree from "../components/DocsTree.vue";
import { useFakeLoading } from "../composables/useFakeLoading";
import { findPagePath } from "../data/pages";

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();
// The view stays mounted between pages of the tree, so it loads again for each id.
const isLoading = useFakeLoading(() => props.id);

const breadcrumb = computed(() =>
  (findPagePath(props.id) ?? []).map((node) => ({ label: node.label })),
);
</script>

<template>
  <mt-page :breadcrumb="breadcrumb" :is-loading="isLoading">
    <template #start>
      <mt-panel :label="t('nav.docs')" icon="regular-books" closable resizable>
        <DocsTree />
      </mt-panel>
    </template>

    <AppSkeleton v-if="isLoading" :lines="4" />
    <mt-text v-else size="xs">{{ t("page.placeholder") }}</mt-text>
  </mt-page>
</template>
