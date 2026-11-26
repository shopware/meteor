<script setup lang="ts">
import {
  MtApp,
  MtButton,
  MtEmptyState,
  MtPage,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [{ label: "Promotions", icon: "discount" }];
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page :breadcrumb="breadcrumb">
      <div class="empty">
        <mt-empty-state
          icon="discount"
          headline="No promotions yet"
          description="Promotions give your customers discounts on products, carts or shipping. Create the first one to see it here."
          centered
        >
          <template #button>
            <mt-button variant="primary" size="default">Create promotion</mt-button>
          </template>
        </mt-empty-state>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
/* Centers the empty state in the whole content, also on tall screens. */
.empty {
  display: grid;
  place-items: center;
  min-height: 100%;
}
</style>
