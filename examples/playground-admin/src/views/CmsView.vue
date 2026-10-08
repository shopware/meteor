<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtContainer,
  MtIcon,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const router = useRouter();

function goBack() {
  if (router.options.history.state.back) router.back();
  else router.push("/");
}
</script>

<template>
  <mt-container as="section" size="l" class="page stack">
    <div>
      <mt-button variant="secondary" size="default" @click="goBack">
        <template #iconFront="{ size }">
          <mt-icon name="regular-chevron-left-xs" :size="size" />
        </template>
        {{ t("cms.back") }}
      </mt-button>
    </div>
  </mt-container>
</template>
