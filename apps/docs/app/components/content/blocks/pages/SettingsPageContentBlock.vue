<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtButton,
  MtCard,
  MtContentHeader,
  MtNav,
  MtPage,
  MtPanel,
  MtSelect,
  MtSwitch,
  MtTextField,
  useUnsavedChanges,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The groups of the settings. With Vue Router, leave out `active`: mt-nav finds the current group
// from the route on its own.
const groups: NavSection[] = [
  {
    header: "Shop",
    items: [
      { label: "Basic information", to: "/settings/basic-information", active: true },
      { label: "Languages", to: "/settings/languages" },
      { label: "Currencies", to: "/settings/currencies" },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Users and permissions", to: "/settings/users" },
      { label: "Integrations", to: "/settings/integrations" },
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [
  { label: "Settings", to: "/settings", icon: "cog" },
  { label: "Basic information" },
];

// Sample data. Replace it with the settings your page loads.
const settings = ref({
  shopName: "Outdoor store",
  email: "shop@example.com",
  language: "en-GB",
  maintenance: false,
});

const savedState = ref(JSON.stringify(settings.value));
const isDirty = computed(() => JSON.stringify(settings.value) !== savedState.value);
const isSaving = ref(false);

// Inside mt-app, this asks before a navigation or a reload discards the changes.
useUnsavedChanges(isDirty);

const languageOptions = [
  { value: "en-GB", label: "English" },
  { value: "de-DE", label: "German" },
];

function discard() {
  settings.value = JSON.parse(savedState.value);
}

function save() {
  isSaving.value = true;

  // Replace the timeout with the request that saves the settings.
  setTimeout(() => {
    savedState.value = JSON.stringify(settings.value);
    isSaving.value = false;
  }, 800);
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="s" :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="secondary" size="default" :disabled="!isDirty" @click="discard">
          Cancel
        </mt-button>
        <mt-button
          variant="primary"
          size="default"
          :disabled="!isDirty"
          :is-loading="isSaving"
          @click="save"
        >
          Save
        </mt-button>
      </template>

      <template #start>
        <mt-panel label="Settings">
          <aside class="groups" aria-label="Settings">
            <mt-nav :sections="groups" label="Settings" />
          </aside>
        </mt-panel>
      </template>

      <div class="stack">
        <mt-content-header title="Basic information" />

        <mt-card title="Shop">
          <div class="stack">
            <mt-text-field v-model="settings.shopName" label="Shop name" required />
            <mt-text-field v-model="settings.email" label="Email address" required />
            <mt-select
              v-model="settings.language"
              label="Default language"
              :options="languageOptions"
              :enable-search="false"
              hide-clearable-button
            />
          </div>
        </mt-card>

        <mt-card title="Maintenance">
          <mt-switch v-model="settings.maintenance" label="Maintenance mode" />
        </mt-card>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.groups {
  padding: var(--scale-size-8);
}

.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}
</style>
