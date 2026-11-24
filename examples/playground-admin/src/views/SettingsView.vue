<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtBanner,
  MtCard,
  MtEmptyState,
  MtIcon,
  MtPage,
  MtSearch,
  MtText,
} from "@shopware-ag/meteor-component-library";

/** The settings of the Administration by group, each with its icon. Labels are below `settings.items`. */
const groups = {
  general: {
    basicInformation: "regular-bars",
    cart: "regular-shopping-cart",
    measurement: "regular-balance-scale",
    numberRanges: "regular-file-signature",
    productUnits: "regular-box",
    search: "regular-search",
    stateMachines: "regular-history",
  },
  customer: {
    customerGroups: "regular-users",
    loginRegistration: "regular-sign-in",
    salutations: "regular-comments",
  },
  automation: {
    flowBuilder: "regular-flow",
    importExport: "regular-database",
    ruleBuilder: "regular-rule",
  },
  localization: {
    countries: "regular-map",
    currencies: "regular-euro",
    languages: "regular-flag",
    snippets: "regular-globe-stand",
    tax: "regular-chart-pie",
  },
  content: {
    customFields: "regular-bars-square",
    mailTemplates: "regular-envelope",
    media: "regular-image",
    newsletter: "regular-inbox",
    seo: "regular-search",
    sitemap: "regular-sitemap",
    tags: "regular-tag",
  },
  commerce: {
    deliveryTimes: "regular-clock",
    documents: "regular-file-text",
    essentialCharacteristics: "regular-check-square",
    paymentMethods: "regular-credit-card",
    products: "regular-products",
    shipping: "regular-truck",
  },
  system: {
    caches: "regular-files",
    logs: "regular-server",
    firstRunWizard: "regular-rocket",
    integrations: "regular-key",
    mailer: "regular-envelope",
    messageQueue: "regular-bars-square",
    privacy: "regular-shield",
    account: "regular-laptop",
    services: "regular-view-grid",
    updates: "regular-sync",
    users: "regular-user",
  },
  plugins: {
    paypal: "regular-credit-card",
    analytics: "regular-chart-line",
  },
} as const;

const { t, locale } = useI18n();

const term = ref("");
const isNoticeVisible = ref(true);

/** The groups with their items sorted by label, as in the Administration, and filtered by the search. */
const visibleGroups = computed(() => {
  const search = term.value.trim().toLowerCase();

  return Object.entries(groups)
    .map(([group, items]) => ({
      group,
      items: Object.entries(items)
        .map(([key, icon]) => ({ key, icon, label: t(`settings.items.${key}`) }))
        .filter((item) => !search || item.label.toLowerCase().includes(search))
        .sort((a, b) => a.label.localeCompare(b.label, locale.value)),
    }))
    .filter((entry) => entry.items.length > 0);
});
</script>

<template>
  <!-- Like the Administration's settings, the page has no header: the card has the title. -->
  <mt-page width="l">
    <mt-card>
      <div class="stack settings">
        <div class="settings__header">
          <mt-text as="h1" size="xl" weight="semibold">
            {{ t("settings.title") }}
          </mt-text>
          <mt-search
            v-model="term"
            class="settings__search"
            size="small"
            :placeholder="t('settings.search')"
          />
        </div>

        <mt-banner
          v-if="isNoticeVisible"
          variant="info"
          closable
          @close="isNoticeVisible = false"
        >
          {{ t("settings.renamedNotice") }}
        </mt-banner>

        <div v-if="visibleGroups.length > 0" class="settings__groups">
          <section
            v-for="entry in visibleGroups"
            :key="entry.group"
            class="settings__group"
          >
            <mt-text as="h3" size="s" weight="semibold">
              {{ t(`settings.groups.${entry.group}`) }}
            </mt-text>
            <ul class="settings__items">
              <li v-for="item in entry.items" :key="item.key">
                <a href="#" class="settings__item" @click.prevent>
                  <mt-icon :name="item.icon" size="var(--scale-size-16)" decorative />
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </section>
        </div>

        <mt-empty-state
          v-else
          icon="regular-cog"
          :headline="t('settings.empty.headline')"
          :description="t('settings.empty.description')"
        />
      </div>
    </mt-card>
  </mt-page>
</template>

<style scoped>
.settings {
  gap: var(--scale-size-24);
}

.settings__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
}

.settings__search {
  width: 16rem;
}

.settings__groups {
  columns: 3 16rem;
  column-gap: var(--scale-size-32);
}

.settings__group {
  display: grid;
  gap: var(--scale-size-8);
  margin-block-end: var(--scale-size-32);
  break-inside: avoid;
}

.settings__items {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.settings__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-8);
  margin-inline: calc(var(--scale-size-8) * -1);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  text-decoration: none;
  border-radius: var(--border-radius-xs);
}

.settings__item .mt-icon {
  color: var(--color-icon-secondary-default);
}

.settings__item:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.settings__item:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
}
</style>
