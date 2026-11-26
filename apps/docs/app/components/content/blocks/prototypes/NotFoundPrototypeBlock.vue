<script setup lang="ts">
import {
  MtApp,
  MtButton,
  MtEmptyState,
  MtPage,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [{ label: "Page not found", icon: "search" }];

const { addSnackbar } = useSnackbar();

// Replace them with your router, for example router.back() and router.push("/").
function goBack() {
  addSnackbar({ message: "Here the previous page would open" });
}

function goHome() {
  addSnackbar({ message: "Here the dashboard would open" });
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: render it for routes that match nothing, inside the shell. -->
    <mt-page :breadcrumb="breadcrumb">
      <div class="empty">
        <mt-empty-state
          icon="search"
          headline="This page doesn't exist"
          description="The link may be broken, or the page was moved or deleted. Check the address, or go on from the dashboard."
          centered
        >
          <template #button>
            <div class="actions">
              <mt-button variant="secondary" size="default" @click="goBack">Go back</mt-button>
              <mt-button variant="primary" size="default" @click="goHome">
                Go to the dashboard
              </mt-button>
            </div>
          </template>
        </mt-empty-state>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.empty {
  display: grid;
  place-items: center;
  min-height: 100%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--scale-size-8);
}
</style>
