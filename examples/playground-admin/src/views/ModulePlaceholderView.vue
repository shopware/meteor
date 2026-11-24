<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtCard,
  MtEmptyState,
  MtPage,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

/** A module the playground leaves empty, such as the media: a page with an empty state. */

const { t } = useI18n();
const route = useRoute();

const key = computed(
  () => route.meta.module as "media" | "themes" | "store" | "salesChannel",
);

/** A sales channel shows its name, the other modules their menu label. */
const breadcrumb = useBreadcrumb(() =>
  key.value === "salesChannel"
    ? String(route.params.id).replace(/^./, (letter) => letter.toUpperCase())
    : t(`nav.${key.value}`),
);

const icons = {
  media: "regular-image",
  themes: "regular-image-text",
  store: "regular-marketplace-stall",
  salesChannel: "regular-storefront",
};
</script>

<template>
  <mt-page width="m" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default">
        {{ t(`modules.${key}.add`) }}
      </mt-button>
    </template>

    <mt-card>
      <mt-empty-state
        :icon="icons[key]"
        :headline="t(`modules.${key}.empty.headline`)"
        :description="t(`modules.${key}.empty.description`)"
      />
    </mt-card>
  </mt-page>
</template>
