<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtBadge,
  MtBanner,
  MtButton,
  MtContentHeader,
  MtEmptyState,
  MtIcon,
  MtLayout,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtNav,
  MtPage,
  MtSearch,
  MtSelect,
  MtText,
  MtTextField,
  useSnackbar,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import {
  integrationCategories,
  integrations as allIntegrations,
  type Integration,
} from "../data/integrations";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { addSnackbar } = useSnackbar();

// Placeholder: connecting an integration only lasts until the page reloads.
const integrations = ref<Integration[]>(structuredClone(allIntegrations));

/** "all", "connected" or a category, from the URL. */
const filter = computed(() => String(route.query.category ?? "all"));
const query = ref("");

watch(
  () => route.query.q,
  (q) => {
    if (typeof q === "string") query.value = q;
  },
  { immediate: true },
);

const sections = computed<NavSection[]>(() => [
  {
    items: [
      {
        id: "all",
        label: t("integrations.all"),
        icon: "regular-view-grid",
        to: { name: "integrations" },
      },
      {
        id: "connected",
        label: t("integrations.connected"),
        icon: "regular-check-circle",
        to: { name: "integrations", query: { category: "connected" } },
      },
    ],
  },
  {
    header: t("integrations.categoriesLabel"),
    items: integrationCategories.map((category) => ({
      id: category.id,
      label: t(`integrations.categories.${category.id}`),
      icon: category.icon,
      to: { name: "integrations", query: { category: category.id } },
    })),
  },
]);

const filterOptions = computed(() =>
  sections.value.flatMap((section) =>
    section.items.map((item: NavItem) => ({
      label: item.label,
      value: item.id,
    })),
  ),
);

function selectFilter(value: unknown) {
  router.push({
    name: "integrations",
    query: value === "all" ? {} : { category: String(value) },
  });
}

function showAll() {
  query.value = "";
  selectFilter("all");
}

function isActive(item: NavItem) {
  return item.id === filter.value;
}

const matching = computed(() => {
  const term = query.value.trim().toLowerCase();

  return integrations.value.filter((integration) => {
    const inFilter =
      filter.value === "all" ||
      (filter.value === "connected"
        ? integration.connections > 0
        : integration.category === filter.value);
    const inSearch =
      !term ||
      integration.name.toLowerCase().includes(term) ||
      integration.description.toLowerCase().includes(term);
    return inFilter && inSearch;
  });
});

const groups = computed(() =>
  integrationCategories
    .map((category) => ({
      ...category,
      items: matching.value.filter(
        (integration) => integration.category === category.id,
      ),
    }))
    .filter((group) => group.items.length > 0),
);

/** Integrations an automation uses without a connected account. */
function needsAccount(integration: Integration) {
  return integration.usage > 0 && integration.connections === 0;
}

const setupFor = ref<Integration | null>(null);
const apiKey = ref("");

function openSetup(integration: Integration) {
  apiKey.value = "";
  setupFor.value = integration;
}

function connect() {
  const integration = setupFor.value;
  if (!integration) return;
  integration.connections += 1;
  setupFor.value = null;
  addSnackbar({
    message: t("integrations.setup.connected", { name: integration.name }),
    variant: "success",
  });
}

const breadcrumb = computed(() => [
  { label: t("integrations.title"), icon: "plug" },
]);
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <mt-layout>
      <template #start>
        <mt-nav
          class="integrations-view__nav"
          :sections="sections"
          :is-active="isActive"
          :label="t('integrations.categoriesLabel')"
        />
      </template>

      <div class="integrations-view">
        <mt-content-header :title="t('integrations.title')">
          <template #actions>
            <mt-button variant="secondary" size="default">
              {{ t("integrations.addCustom") }}
            </mt-button>
          </template>

          <mt-text color="color-text-secondary-default">
            {{ t("integrations.description") }}
          </mt-text>
        </mt-content-header>

        <div class="integrations-view__toolbar">
          <mt-search
            v-model="query"
            class="integrations-view__search"
            :placeholder="t('integrations.search')"
          />
          <!-- Below the layout's breakpoint the categories would push the cards far down, so a
               select takes their place. -->
          <mt-select
            class="integrations-view__category"
            :model-value="filter"
            :options="filterOptions"
            :aria-label="t('integrations.categoriesLabel')"
            hide-clearable-button
            @update:model-value="selectFilter"
          />
        </div>

        <section
          v-for="group in groups"
          :key="group.id"
          class="integrations-view__group"
          :aria-labelledby="`integrations-${group.id}`"
        >
          <mt-text
            :id="`integrations-${group.id}`"
            as="h2"
            size="s"
            weight="semibold"
          >
            {{ t(`integrations.categories.${group.id}`) }}
          </mt-text>

          <ul class="integrations-view__grid">
            <li
              v-for="integration in group.items"
              :key="integration.id"
              class="integrations-view__card"
            >
              <div class="integrations-view__card-header">
                <span
                  class="integrations-view__logo"
                  :style="{
                    '--integrations-view-color': `var(${integration.color})`,
                  }"
                >
                  <mt-icon
                    :name="integration.icon"
                    size="var(--scale-size-16)"
                    decorative
                  />
                </span>

                <mt-text as="h3" size="xs" weight="semibold">
                  {{ integration.name }}
                </mt-text>

                <mt-badge
                  v-if="integration.connections > 0"
                  class="integrations-view__badge"
                  variant="positive"
                  status-indicator
                >
                  {{
                    t(
                      "integrations.status.connected",
                      { count: integration.connections },
                      integration.connections,
                    )
                  }}
                </mt-badge>
                <mt-badge
                  v-else-if="needsAccount(integration)"
                  class="integrations-view__badge"
                  variant="attention"
                  status-indicator
                >
                  {{ t("integrations.status.missing") }}
                </mt-badge>
              </div>

              <mt-text
                size="xs"
                color="color-text-secondary-default"
                class="integrations-view__description"
              >
                {{ integration.description }}
              </mt-text>

              <div class="integrations-view__card-footer">
                <mt-button
                  variant="secondary"
                  size="small"
                  @click="openSetup(integration)"
                >
                  {{
                    integration.connections > 0
                      ? t("integrations.manage")
                      : t("integrations.connect")
                  }}
                </mt-button>

                <mt-text size="2xs" color="color-text-secondary-default">
                  {{
                    integration.usage
                      ? t(
                          "integrations.usage.count",
                          { count: integration.usage },
                          integration.usage,
                        )
                      : t("integrations.usage.none")
                  }}
                </mt-text>
              </div>
            </li>
          </ul>
        </section>

        <mt-empty-state
          v-if="!groups.length"
          icon="regular-plug"
          :headline="t('integrations.empty.headline')"
          :description="t('integrations.empty.description')"
        >
          <template #button>
            <mt-button variant="secondary" size="default" @click="showAll">
              {{ t("integrations.empty.clear") }}
            </mt-button>
          </template>
        </mt-empty-state>
      </div>
    </mt-layout>

    <mt-modal-root
      :is-open="setupFor !== null"
      @change="(open: boolean) => !open && (setupFor = null)"
    >
      <mt-modal
        v-if="setupFor"
        :title="t('integrations.setup.title', { name: setupFor.name })"
        width="s"
      >
        <div class="integrations-view__setup">
          <mt-banner variant="info">
            {{ t("integrations.setup.note") }}
          </mt-banner>
          <mt-text-field
            v-model="apiKey"
            :label="t('integrations.setup.apiKey')"
            autocomplete="off"
          />
        </div>

        <template #footer>
          <div class="integrations-view__actions">
            <mt-modal-close :as="MtButton" variant="secondary" size="default">
              {{ t("integrations.setup.cancel") }}
            </mt-modal-close>
            <mt-modal-action
              :as="MtButton"
              variant="primary"
              size="default"
              :disabled="!apiKey.trim()"
              @click="connect"
            >
              {{ t("integrations.setup.connect") }}
            </mt-modal-action>
          </div>
        </template>
      </mt-modal>
    </mt-modal-root>
  </mt-page>
</template>

<style scoped>
.integrations-view {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
  min-width: 0;
}

.integrations-view__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-12);
}

.integrations-view__search {
  flex: 1 1 var(--scale-size-192);
  max-width: var(--scale-size-256);
}

.integrations-view__category {
  display: none;
  flex: 1 1 var(--scale-size-192);
}

@container mt-layout (width < 49.75rem) {
  .integrations-view__nav {
    display: none;
  }

  .integrations-view__category {
    display: block;
  }

  .integrations-view__search {
    max-width: none;
  }
}

.integrations-view__group {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}

.integrations-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The card surface of mt-card, smaller: a list of many, not a section of a page. */
.integrations-view__card {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
  padding: var(--scale-size-16);
  background: var(--color-elevation-surface-raised);
  border: var(--scale-size-1) solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card);
}

.integrations-view__card-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}

.integrations-view__badge {
  margin-inline-start: auto;
  white-space: nowrap;
}

.integrations-view__logo {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  color: var(--color-static-white);
  background: var(--integrations-view-color);
  border-radius: 24%;
}

.integrations-view__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.integrations-view__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-12);
  margin-block-start: auto;
}

.integrations-view__setup {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}

.integrations-view__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
