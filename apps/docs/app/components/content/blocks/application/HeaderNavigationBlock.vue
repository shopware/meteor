<script setup lang="ts">
import { ref } from "vue";
import {
  MtApp,
  MtAvatar,
  MtButton,
  MtIcon,
  MtPage,
  MtSearch,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const term = ref("");

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];
</script>

<template>
  <mt-app>
    <template #header>
      <div class="header">
        <mt-icon
          name="regular-shopware"
          size="var(--scale-size-24)"
          color="var(--color-icon-brand-default)"
          role="img"
          aria-label="Shop admin"
        />

        <mt-search v-model="term" size="small" placeholder="Search" />

        <div class="header__actions">
          <mt-button variant="tertiary" size="default" square aria-label="Help">
            <mt-icon name="regular-question-circle" size="var(--scale-size-16)" decorative />
          </mt-button>
          <mt-button variant="tertiary" size="default" square aria-label="Notifications">
            <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
          </mt-button>
          <mt-avatar first-name="Mila" last-name="Hoffmann" size="s" aria-label="Mila Hoffmann" />
        </div>
      </div>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>

<style scoped>
/* The brand, the search in the center and the actions at the end. */
.header {
  display: grid;
  grid-template-columns: 1fr minmax(0, 24rem) 1fr;
  align-items: center;
  gap: var(--scale-size-16);
  padding-block: var(--scale-size-8);
}

.header__actions {
  display: flex;
  justify-self: end;
  align-items: center;
  gap: var(--scale-size-4);
}
</style>
