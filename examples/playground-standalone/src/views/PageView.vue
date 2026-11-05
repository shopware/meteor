<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtPage, MtText } from "@shopware-ag/meteor-component-library";
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
    <mt-text size="xs">{{ t("page.placeholder") }}</mt-text>
  </mt-page>
</template>
