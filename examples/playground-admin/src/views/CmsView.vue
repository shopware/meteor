<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { MtButton, MtIcon } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const router = useRouter();

function goBack() {
  if (router.options.history.state.back) router.back();
  else router.push("/");
}
</script>

<template>
  <section class="page">
    <mt-button variant="secondary" size="default" @click="goBack">
      <template #iconFront="{ size }">
        <mt-icon name="regular-chevron-left-xs" :size="size" />
      </template>
      {{ t("cms.back") }}
    </mt-button>
  </section>
</template>
