<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtButton,
  MtCard,
  MtContentHeader,
  MtEmptyState,
  MtIcon,
  MtLayout,
  MtNav,
  MtPage,
  MtSearch,
  MtSelect,
  MtText,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import IntegrationLogo, { type Brand } from "../components/IntegrationLogo.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const headingId = useId();

const categoryIcons = {
  commerce: "regular-storefront",
  erp: "regular-briefcase",
  crm: "regular-megaphone",
  email: "regular-envelope",
  messaging: "regular-comments",
  files: "regular-folder",
  productivity: "regular-check-square",
  tools: "regular-analytics",
};

type Category = keyof typeof categoryIcons;

const categories = Object.keys(categoryIcons) as Category[];

interface Integration {
  name: string;
  category: Category;
  /** Shows the brand's logo, otherwise the category's icon. */
  brand?: Brand;
  connected?: boolean;
}

// Example integrations without real data behind them.
const integrations: Integration[] = [
  {
    name: "Akeneo",
    category: "commerce",
    connected: true,
  },
  {
    name: "Pimcore",
    category: "commerce",
    brand: "pimcore",
  },
  {
    name: "Shopware",
    category: "commerce",
    brand: "shopware",
    connected: true,
  },
  {
    name: "ERPNext",
    category: "erp",
  },
  {
    name: "Odoo",
    category: "erp",
    brand: "odoo",
  },
  {
    name: "SAP",
    category: "erp",
    brand: "sap",
    connected: true,
  },
  {
    name: "Brevo",
    category: "crm",
    brand: "brevo",
  },
  {
    name: "HubSpot",
    category: "crm",
    brand: "hubspot",
    connected: true,
  },
  {
    name: "Klaviyo",
    category: "crm",
  },
  {
    name: "Mailgun",
    category: "email",
    brand: "mailgun",
  },
  {
    name: "Postmark",
    category: "email",
  },
  {
    name: "SendGrid",
    category: "email",
  },
  {
    name: "Slack",
    category: "messaging",
    brand: "slack",
    connected: true,
  },
  {
    name: "Discord",
    category: "messaging",
    brand: "discord",
  },
  {
    name: "Microsoft Teams",
    category: "messaging",
    brand: "microsoft",
  },
  {
    name: "Google Drive",
    category: "files",
    brand: "googleDrive",
    connected: true,
  },
  {
    name: "Dropbox",
    category: "files",
    brand: "dropbox",
  },
  {
    name: "Amazon S3",
    category: "files",
    brand: "aws",
  },
  {
    name: "Notion",
    category: "productivity",
  },
  {
    name: "Asana",
    category: "productivity",
    brand: "asana",
  },
  {
    name: "Airtable",
    category: "productivity",
    brand: "airtable",
  },
  {
    name: "Google Analytics",
    category: "tools",
    brand: "googleAnalytics",
  },
  {
    name: "Mixpanel",
    category: "tools",
    brand: "mixpanel",
  },
];

const search = ref("");

function queryValue(name: string) {
  const value = route.query[name];
  return typeof value === "string" ? value : undefined;
}

const onlyConnected = computed(() => queryValue("filter") === "connected");
const category = computed(() => queryValue("category"));

const counts = computed<Record<string, number>>(() => ({
  all: integrations.length,
  connected: integrations.filter(({ connected }) => connected).length,
  ...Object.fromEntries(
    categories.map((id) => [
      id,
      integrations.filter((integration) => integration.category === id).length,
    ]),
  ),
}));

// The filter is part of the URL, so mt-page keeps its drawer open while it changes.
const filterSections = computed<NavSection[]>(() => [
  {
    items: [
      {
        id: "all",
        label: t("integrations.all"),
        icon: "regular-layer-group",
        to: { name: "integrations" },
        active: !onlyConnected.value && !category.value,
      },
      {
        id: "connected",
        label: t("integrations.connected"),
        icon: "regular-check-circle",
        to: { name: "integrations", query: { filter: "connected" } },
        active: onlyConnected.value,
      },
    ],
  },
  {
    header: t("integrations.categories"),
    items: categories.map((id) => ({
      id,
      label: t(`integrations.category.${id}`),
      icon: categoryIcons[id],
      to: { name: "integrations", query: { category: id } },
      active: category.value === id,
    })),
  },
]);

// The same filters as a select, for when the filters sit above the cards.
const filterItems = computed(() =>
  filterSections.value.flatMap(({ items }) => items),
);

const filterOptions = computed(() =>
  filterItems.value.map(({ id, label }) => ({
    value: id,
    label: `${label} (${counts.value[id ?? ""]})`,
  })),
);

const activeFilter = computed(
  () => filterItems.value.find(({ active }) => active)?.id,
);

function selectFilter(id: string) {
  const item = filterItems.value.find((filter) => filter.id === id);
  if (item?.to) router.push(item.to);
}

const groups = computed(() => {
  const term = search.value.trim().toLowerCase();
  const matches = integrations.filter(
    (integration) =>
      (!onlyConnected.value || integration.connected) &&
      (!category.value || integration.category === category.value) &&
      integration.name.toLowerCase().includes(term),
  );

  return categories
    .map((id) => ({
      id,
      integrations: matches.filter(
        (integration) => integration.category === id,
      ),
    }))
    .filter((group) => group.integrations.length);
});
</script>

<template>
  <mt-page width="l">
    <div class="integrations">
      <mt-content-header :title="t('integrations.title')">
        <template #actions>
          <mt-button variant="secondary" size="small">
            <template #iconFront>
              <mt-icon
                name="regular-plus-xs"
                size="var(--scale-size-12)"
                decorative
              />
            </template>
            {{ t("integrations.addCustom") }}
          </mt-button>
        </template>
      </mt-content-header>

      <mt-layout>
        <!-- Next to the cards on a wide page, above them on a narrow one. -->
        <template #start>
          <aside
            class="integration-filters"
            :aria-label="t('integrations.filters')"
          >
            <mt-search v-model="search" size="small" />

            <div class="integration-filters__nav">
              <mt-nav
                :sections="filterSections"
                :label="t('integrations.filters')"
              >
                <template #suffix="{ item }">
                  <mt-text
                    as="span"
                    size="xs"
                    color="color-text-secondary-default"
                  >
                    {{ counts[item.id ?? ""] }}
                  </mt-text>
                </template>
              </mt-nav>
            </div>

            <div class="integration-filters__select">
              <mt-select
                :model-value="activeFilter"
                :options="filterOptions"
                :label="t('integrations.filters')"
                :enable-search="false"
                hide-clearable-button
                small
                @update:model-value="selectFilter"
              />
            </div>
          </aside>
        </template>

        <div class="integrations__groups">
          <section
            v-for="group in groups"
            :key="group.id"
            class="integrations__category"
            :aria-labelledby="`${headingId}-${group.id}`"
          >
            <mt-text
              :id="`${headingId}-${group.id}`"
              as="h3"
              size="xs"
              weight="semibold"
              color="color-text-secondary-default"
            >
              {{ t(`integrations.category.${group.id}`) }}
            </mt-text>

            <div class="integrations__cards">
              <mt-card
                v-for="integration in group.integrations"
                :key="integration.name"
              >
                <div class="integration">
                  <div class="integration__header">
                    <IntegrationLogo
                      :brand="integration.brand"
                      :icon="categoryIcons[integration.category]"
                      small
                    />
                    <div class="integration__name">
                      <mt-text as="h4" size="xs" weight="semibold">
                        {{ integration.name }}
                      </mt-text>
                    </div>
                  </div>

                  <div class="integration__skeleton" aria-hidden="true">
                    <span class="integration__bar" />
                    <span class="integration__bar" />
                    <span class="integration__bar" />
                  </div>
                </div>
              </mt-card>
            </div>
          </section>

          <mt-empty-state
            v-if="!groups.length"
            icon="regular-search"
            :headline="t('integrations.empty.title')"
            :description="t('integrations.empty.description')"
          />
        </div>
      </mt-layout>
    </div>
  </mt-page>
</template>

<style scoped>
.integration-filters {
  display: grid;
  align-content: start;
  gap: var(--scale-size-32);
}

.integration-filters__select {
  display: none;
}

/* mt-layout fills it, so the query below measures the layout's width. */
.integrations {
  display: grid;
  gap: var(--scale-size-40);
  container: integrations / inline-size;
}

/*
 * Below the width where mt-layout moves its start column above the content, the filters become a
 * select, so the cards don't move down by the height of the whole list.
 */
@container integrations (width < 49.75rem) {
  .integration-filters {
    gap: var(--scale-size-16);
  }

  .integration-filters__nav {
    display: none;
  }

  .integration-filters__select {
    display: block;
  }
}

.integrations__groups {
  display: grid;
  gap: var(--scale-size-32);
}

.integrations__category {
  display: grid;
  gap: var(--scale-size-12);
}

/*
 * At most three columns: each column is at least a third of the row and at least 256px, so the
 * cards drop to two columns and then one as the content gets narrower.
 */
.integrations__cards {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      min(
        100%,
        max(var(--scale-size-256), calc((100% - 2 * var(--scale-size-16)) / 3))
      ),
      1fr
    )
  );
  gap: var(--scale-size-16);
}

/* mt-card sets its padding on the content, from this property. */
.integrations__cards :deep(.mt-card__content) {
  --mt-card-content-padding: var(--scale-size-16);
}

.integration {
  display: grid;
  gap: var(--scale-size-16);
}

.integration__header {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-12);
}

/* The first line of the name is centered on the logo, a longer name wraps below. */
.integration__name {
  flex: 1 1 auto;
  min-width: 0;
  padding-block-start: calc(
    (var(--scale-size-32) - var(--font-line-height-xs)) / 2
  );
}

/* Custom, because mt-skeleton-bar shimmers like content that is loading. */
.integration__skeleton {
  display: grid;
  gap: var(--scale-size-8);
}

.integration__bar {
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
  background: var(--color-background-tertiary-default);
}

.integration__bar:last-child {
  width: 60%;
}
</style>
