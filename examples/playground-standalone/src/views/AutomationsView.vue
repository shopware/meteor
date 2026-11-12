<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtBadge,
  MtBanner,
  MtButton,
  MtContentHeader,
  MtDataTable,
  MtEmptyState,
  MtIcon,
  MtPage,
  MtText,
  MtTooltip,
  useSnackbar,
  type Filter,
} from "@shopware-ag/meteor-component-library";
import {
  useLocalListing,
  type DataTableColumn,
} from "../composables/useLocalListing";
import { useRelativeTime } from "../composables/useRelativeTime";
import {
  automations as allAutomations,
  type Automation,
  type AutomationStatus,
} from "../data/automations";
import { findIntegration, integrations } from "../data/integrations";

const { t } = useI18n();
const route = useRoute();
const relativeTime = useRelativeTime();
const { addSnackbar } = useSnackbar();

// Placeholder: deleting only removes an automation until the page reloads.
const automations = ref<Automation[]>([...allAutomations]);

const listing = useLocalListing(automations, {
  searchText: (automation) => [automation.name],
  filterValues: (automation, filterId) => {
    if (filterId === "status") return [automation.status];
    if (filterId === "integration") return automation.steps;
    if (filterId === "attention") return automation.attention ? ["yes"] : [];
    return [];
  },
  sortValue: (automation, property) =>
    property === "updatedMinutesAgo"
      ? automation.updatedMinutesAgo
      : property === "status"
        ? t(`automations.statuses.${automation.status}`)
        : automation.name,
  sortBy: "updatedMinutesAgo",
});

const statuses: AutomationStatus[] = ["live", "paused", "draft", "failed"];

const badgeVariants: Record<
  AutomationStatus,
  "positive" | "attention" | "neutral" | "critical"
> = {
  live: "positive",
  paused: "attention",
  draft: "neutral",
  failed: "critical",
};

const columns = computed<DataTableColumn[]>(() => [
  {
    label: t("automations.columns.name"),
    property: "name",
    renderer: "text",
    position: 100,
    width: 480,
  },
  {
    label: t("automations.columns.status"),
    property: "status",
    renderer: "text",
    position: 200,
  },
  {
    label: t("automations.columns.steps"),
    property: "steps",
    renderer: "text",
    position: 300,
    sortable: false,
  },
  {
    label: t("automations.columns.updated"),
    property: "updatedMinutesAgo",
    renderer: "text",
    position: 400,
  },
]);

const filters = computed<Filter[]>(() => [
  {
    id: "status",
    label: t("automations.filters.status"),
    type: {
      id: "options",
      options: statuses.map((status) => ({
        id: status,
        label: t(`automations.statuses.${status}`),
      })),
    },
  },
  {
    id: "integration",
    label: t("automations.filters.integration"),
    type: {
      id: "options",
      options: integrations
        .filter((integration) =>
          automations.value.some((automation) =>
            automation.steps.includes(integration.id),
          ),
        )
        .map((integration) => ({
          id: integration.id,
          label: integration.name,
        })),
    },
  },
  {
    id: "attention",
    label: t("automations.filters.attention"),
    type: {
      id: "options",
      options: [{ id: "yes", label: t("automations.filters.needsAttention") }],
    },
  },
]);

const needingAttention = computed(
  () => automations.value.filter((automation) => automation.attention).length,
);
const isBannerClosed = ref(false);

/** Shows only the automations that need attention, as the banner and the inbox offer. */
function showAttention() {
  const attention = filters.value.find((filter) => filter.id === "attention");
  if (attention) listing.appliedFilters.value = [attention];
}

// Links from the inbox and the command palette.
watch(
  () => route.query,
  (query) => {
    if (query.attention) showAttention();
    if (typeof query.q === "string") listing.term.value = query.q;
  },
  { immediate: true },
);

function deleteAutomation(automation: Automation) {
  automations.value = automations.value.filter(
    (item) => item.id !== automation.id,
  );
  addSnackbar({ message: automation.name, variant: "success" });
}

const breadcrumb = computed(() => [
  { label: t("automations.title"), icon: "flow" },
]);
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <div class="automations-view">
      <mt-content-header :title="t('automations.title')">
        <template #actions>
          <mt-button variant="secondary" size="default">
            {{ t("automations.templates") }}
          </mt-button>
          <mt-button variant="primary" size="default">
            {{ t("automations.create") }}
          </mt-button>
        </template>

        <mt-text color="color-text-secondary-default">
          {{ t("automations.description") }}
        </mt-text>
      </mt-content-header>

      <mt-banner
        v-if="needingAttention && !isBannerClosed"
        variant="attention"
        :title="
          t(
            'automations.banner.title',
            { count: needingAttention },
            needingAttention,
          )
        "
        closable
        @close="isBannerClosed = true"
      >
        <div class="automations-view__banner">
          <span>{{ t("automations.banner.text") }}</span>
          <mt-button variant="secondary" size="small" @click="showAttention">
            {{ t("automations.banner.show") }}
          </mt-button>
        </div>
      </mt-banner>

      <mt-data-table
        v-model:applied-filters="listing.appliedFilters.value"
        :caption="t('automations.title')"
        :data-source="listing.items.value"
        :columns="columns"
        :current-page="listing.page.value"
        :pagination-limit="listing.limit.value"
        :pagination-total-items="listing.total.value"
        :sort-by="listing.sortBy.value"
        :sort-direction="listing.sortDirection.value"
        :search-value="listing.term.value"
        :filters="filters"
        disable-edit
        @pagination-current-page-change="listing.page.value = $event"
        @pagination-limit-change="listing.limit.value = $event"
        @search-value-change="listing.term.value = $event"
        @sort-change="listing.onSortChange"
        @item-delete="deleteAutomation"
      >
        <template #column-name="{ data }">
          <span class="automations-view__name">
            <mt-text size="xs">{{ data.name }}</mt-text>

            <mt-tooltip
              v-if="data.attention"
              :content="t(`automations.reasons.${data.attention}`)"
            >
              <template #default="params">
                <span
                  v-bind="params"
                  class="automations-view__attention"
                  tabindex="0"
                  role="img"
                  :aria-label="t(`automations.reasons.${data.attention}`)"
                >
                  <mt-icon
                    name="regular-exclamation-triangle"
                    size="var(--scale-size-14)"
                    decorative
                  />
                </span>
              </template>
            </mt-tooltip>
          </span>
        </template>

        <template #column-status="{ data }">
          <mt-badge
            :variant="badgeVariants[data.status as AutomationStatus]"
            status-indicator
          >
            {{ t(`automations.statuses.${data.status}`) }}
          </mt-badge>
        </template>

        <template #column-steps="{ data }">
          <ol class="automations-view__steps">
            <li v-for="step in data.steps as string[]" :key="step">
              <span
                class="automations-view__logo"
                :style="{
                  '--automations-view-color': `var(${findIntegration(step)?.color})`,
                }"
                :title="findIntegration(step)?.name"
              >
                <mt-icon
                  :name="findIntegration(step)?.icon ?? 'regular-plug'"
                  size="var(--scale-size-10)"
                  decorative
                />
              </span>
              <span class="visually-hidden">{{
                findIntegration(step)?.name
              }}</span>
            </li>
          </ol>
        </template>

        <template #column-updatedMinutesAgo="{ data }">
          <mt-text size="xs" color="color-text-secondary-default">
            {{ relativeTime(-data.updatedMinutesAgo) }}
          </mt-text>
        </template>

        <template #empty-state>
          <mt-empty-state
            icon="regular-flow"
            :headline="
              listing.isFiltered.value
                ? t('automations.empty.filteredHeadline')
                : t('automations.empty.headline')
            "
            :description="
              listing.isFiltered.value
                ? t('automations.empty.filteredDescription')
                : t('automations.empty.description')
            "
          >
            <template #button>
              <mt-button
                v-if="listing.isFiltered.value"
                variant="secondary"
                size="default"
                @click="listing.clear"
              >
                {{ t("automations.empty.clear") }}
              </mt-button>
              <mt-button v-else variant="primary" size="default">
                {{ t("automations.create") }}
              </mt-button>
            </template>
          </mt-empty-state>
        </template>
      </mt-data-table>
    </div>
  </mt-page>
</template>

<style scoped>
.automations-view {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}

.automations-view__banner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--scale-size-12);
}

.automations-view__name {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.automations-view__attention {
  display: inline-flex;
  color: var(--color-icon-attention-default);
  border-radius: var(--border-radius-xs);
}

.automations-view__attention:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

/* The integrations of the steps in order, like a path: small logos with a chevron between. */
.automations-view__steps {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.automations-view__steps li {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
}

.automations-view__steps li + li::before {
  content: "›";
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
}

.automations-view__logo {
  display: grid;
  place-items: center;
  width: var(--scale-size-20);
  height: var(--scale-size-20);
  color: var(--color-static-white);
  background: var(--automations-view-color);
  border-radius: 24%;
}
</style>
