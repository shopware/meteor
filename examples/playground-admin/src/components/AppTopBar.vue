<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink, useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtAppPanelTrigger,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtText,
} from "@shopware-ag/meteor-component-library";
import { search } from "../../server/repository";
import {
  searchTypes,
  useGlobalSearch,
  type SearchType,
} from "../composables/useGlobalSearch";

/**
 * The bar above every page of the Administration: the search, with the type of entity it looks
 * for, and the help and notification buttons.
 */

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { term, type } = useGlobalSearch();

/** The list each search type opens, to search it from another page. */
const listRoutes: Partial<Record<SearchType, string>> = {
  products: "product-list",
  categories: "category",
  customers: "customer-list",
  orders: "order-list",
  manufacturers: "manufacturers",
  properties: "properties",
  reviews: "reviews",
  promotions: "promotions",
  newsletter: "newsletter",
  productStreams: "productStreams",
  rules: "rules",
  flows: "flows",
  cms: "cms-list",
};

/** The search type of the current module, from the route, or "all" outside of a module. */
const routeType = computed<SearchType>(() => route.meta.search ?? "all");

// A new module starts with its own type and an empty search.
watch(
  () => route.matched[0]?.path,
  () => {
    term.value = "";
    type.value = routeType.value;
  },
  { immediate: true },
);

const placeholder = computed(() =>
  type.value === "all"
    ? t("search.placeholderAll")
    : t("search.placeholder", {
        type: t(`search.types.${type.value}`).toLowerCase(),
      }),
);

const isFocused = ref(false);

/** With the type "all", the search shows the first matches of each entity below the field. */
const results = computed(() => {
  const value = term.value.trim();
  if (type.value !== "all" || value.length < 2) return [];

  const criteria = { page: 1, limit: 3, term: value };

  return [
    {
      type: "products" as const,
      icon: "regular-products",
      entries: search("product", criteria).data.map((product) => ({
        id: product.id,
        label: product.name,
        detail: product.productNumber,
        to: { name: "product-detail", params: { id: product.id } },
      })),
    },
    {
      type: "customers" as const,
      icon: "regular-users",
      entries: search("customer", criteria).data.map((customer) => ({
        id: customer.id,
        label: `${customer.firstName} ${customer.lastName}`,
        detail: customer.email,
        to: { name: "customer-detail", params: { id: customer.id } },
      })),
    },
    {
      type: "orders" as const,
      icon: "regular-shopping-bag",
      entries: search("order", criteria).data.map((order) => ({
        id: order.id,
        label: t("orders.detailTitle", { number: order.orderNumber }),
        detail: order.customerName,
        to: { name: "order-detail", params: { id: order.id } },
      })),
    },
  ].filter((group) => group.entries.length > 0);
});

const showResults = computed(
  () => isFocused.value && type.value === "all" && term.value.trim().length >= 2,
);

/** Enter on another module's page opens the list of the selected type with the term. */
function submit() {
  const target = listRoutes[type.value];
  if (!target || type.value === routeType.value) return;

  const keep = term.value;
  const nextType = type.value;

  router.push({ name: target }).then(() => {
    term.value = keep;
    type.value = nextType;
  });
}

function onFocusOut(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement;
  if (!root.contains(event.relatedTarget as Node | null)) isFocused.value = false;
}

watch(() => route.fullPath, () => (isFocused.value = false));
</script>

<template>
  <div class="app-top-bar">
    <!-- The shell's panel buttons live here instead of in the page headers. -->
    <mt-app-panel-trigger class="app-top-bar__menu" panel="navigation" />

    <div
      class="app-top-bar__search"
      role="search"
      @focusin="isFocused = true"
      @focusout="onFocusOut"
      @keydown.esc="isFocused = false"
    >
      <mt-dropdown-menu-root>
        <mt-dropdown-menu-trigger as-child>
          <button
            type="button"
            class="app-top-bar__type"
            :aria-label="t('search.typeLabel')"
          >
            {{ t(`search.types.${type}`) }}
            <mt-icon
              name="regular-chevron-down-xs"
              size="var(--scale-size-12)"
              decorative
            />
          </button>
        </mt-dropdown-menu-trigger>
        <mt-dropdown-menu-portal>
          <mt-action-menu>
            <mt-action-menu-item
              v-for="entry in searchTypes"
              :key="entry"
              @select="type = entry"
            >
              {{ t(`search.types.${entry}`) }}
            </mt-action-menu-item>
          </mt-action-menu>
        </mt-dropdown-menu-portal>
      </mt-dropdown-menu-root>

      <input
        v-model="term"
        class="app-top-bar__input"
        type="search"
        :placeholder="placeholder"
        :aria-label="placeholder"
        autocomplete="off"
        @keydown.enter="submit"
      />

      <mt-icon
        class="app-top-bar__icon"
        name="regular-search"
        size="var(--scale-size-16)"
        decorative
      />

      <div v-if="showResults" class="app-top-bar__results">
        <template v-if="results.length > 0">
          <section v-for="group in results" :key="group.type">
            <mt-text
              as="h2"
              size="2xs"
              weight="semibold"
              color="color-text-secondary-default"
              class="app-top-bar__group"
            >
              {{ t(`search.types.${group.type}`) }}
            </mt-text>
            <ul>
              <li v-for="entry in group.entries" :key="entry.id">
                <router-link class="app-top-bar__result" :to="entry.to">
                  <mt-icon :name="group.icon" size="var(--scale-size-16)" decorative />
                  <span class="app-top-bar__result-label">{{ entry.label }}</span>
                  <span class="app-top-bar__result-detail">{{ entry.detail }}</span>
                </router-link>
              </li>
            </ul>
          </section>
        </template>
        <mt-text v-else size="xs" color="color-text-secondary-default" class="app-top-bar__empty">
          {{ t("search.noResults") }}
        </mt-text>
      </div>
    </div>

    <div class="app-top-bar__actions">
      <mt-button
        variant="tertiary"
        size="default"
        square
        :aria-label="t('search.help')"
      >
        <mt-icon name="regular-question-circle" size="var(--scale-size-20)" decorative />
      </mt-button>
      <mt-button
        class="app-top-bar__notifications"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('search.notifications')"
      >
        <mt-icon name="regular-bell" size="var(--scale-size-20)" decorative />
      </mt-button>
      <mt-app-panel-trigger panel="sidebar" />
    </div>
  </div>
</template>

<style scoped>
/* The search sits in the content column of the pages, the buttons at the end of the bar. */
.app-top-bar {
  display: grid;
  /* Equal sides, wide enough for the buttons, keep the search centered above the content. */
  grid-template-columns: minmax(10rem, 1fr) minmax(0, 60rem) minmax(10rem, 1fr);
  align-items: center;
  gap: var(--scale-size-8);
  min-height: var(--scale-size-72);
  padding-inline: var(--scale-size-16);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.app-top-bar__menu {
  grid-column: 1;
  justify-self: start;
}

.app-top-bar__search {
  position: relative;
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  height: var(--scale-size-48);
  padding-inline: var(--scale-size-6) var(--scale-size-16);
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.app-top-bar__search:focus-within {
  border-color: var(--color-border-brand-default);
}

.app-top-bar__type {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-8);
  min-width: 8rem;
  height: var(--scale-size-36);
  padding-inline: var(--scale-size-12);
  font: inherit;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
}

.app-top-bar__type:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.app-top-bar__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  font: inherit;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  background: none;
  border: 0;
  outline: none;
}

.app-top-bar__input::placeholder {
  color: var(--color-text-secondary-default);
}

.app-top-bar__input::-webkit-search-cancel-button {
  display: none;
}

.app-top-bar__icon {
  flex: none;
  color: var(--color-icon-primary-default);
}

.app-top-bar__actions {
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-4);
}

.app-top-bar__notifications {
  position: relative;
}

.app-top-bar__notifications::after {
  content: "";
  position: absolute;
  inset-block-start: var(--scale-size-6);
  inset-inline-end: var(--scale-size-6);
  width: var(--scale-size-6);
  height: var(--scale-size-6);
  background-color: var(--color-icon-critical-default);
  border-radius: 50%;
}

.app-top-bar__results {
  position: absolute;
  inset-block-start: calc(100% + var(--scale-size-4));
  inset-inline: 0;
  z-index: 10;
  display: grid;
  gap: var(--scale-size-8);
  max-height: 28rem;
  overflow: auto;
  padding: var(--scale-size-8);
  background-color: var(--color-elevation-surface-overlay, var(--color-elevation-surface-default));
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default);
}

.app-top-bar__results ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-top-bar__group {
  padding: var(--scale-size-4) var(--scale-size-8);
  text-transform: uppercase;
}

.app-top-bar__result {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-8);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  text-decoration: none;
  border-radius: var(--border-radius-xs);
}

.app-top-bar__result .mt-icon {
  color: var(--color-icon-secondary-default);
}

.app-top-bar__result:hover,
.app-top-bar__result:focus-visible {
  outline: none;
  background-color: var(--color-interaction-secondary-hover);
}

.app-top-bar__result-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-top-bar__result-detail {
  color: var(--color-text-secondary-default);
}

.app-top-bar__empty {
  padding: var(--scale-size-8);
}

@media (max-width: 720px) {
  .app-top-bar {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .app-top-bar__search {
    grid-column: 2;
  }

  .app-top-bar__actions {
    grid-column: 3;
  }

  .app-top-bar__type {
    display: none;
  }
}
</style>
