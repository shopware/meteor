<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPage,
  MtSearch,
  MtTabs,
  MtText,
} from "@shopware-ag/meteor-component-library";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useFormat } from "../composables/useFormat";
import { layouts } from "../cmsLayouts";

const { t } = useI18n();
const format = useFormat();
const breadcrumb = useBreadcrumb(() => t("cms.title"));

const activeType = ref("all");
const term = ref("");

const tabs = computed(() =>
  (["all", "page", "landingpage", "product_list", "product_detail"] as const).map(
    (name) => ({ name, label: t(`cms.types.${name}`) }),
  ),
);

const visibleLayouts = computed(() => {
  const search = term.value.trim().toLowerCase();

  return layouts.filter(
    (layout) =>
      (activeType.value === "all" || layout.type === activeType.value) &&
      (!search || layout.name.toLowerCase().includes(search)),
  );
});
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default">
        {{ t("cms.create") }}
      </mt-button>
      <app-header-actions />
    </template>

    <div class="stack">
      <div class="cms-list__toolbar">
        <mt-tabs
          :items="tabs"
          :default-item="activeType"
          @new-item-active="activeType = $event"
        />
        <mt-search
          v-model="term"
          class="cms-list__search"
          size="small"
          :placeholder="t('cms.search')"
        />
      </div>

      <ul class="cms-list">
        <li v-for="layout in visibleLayouts" :key="layout.id" class="cms-list__item">
          <router-link
            class="cms-list__preview"
            :to="{ name: 'cms', params: { id: layout.id } }"
            :aria-label="layout.name"
          >
            <span class="cms-list__block cms-list__block--hero" />
            <span class="cms-list__row">
              <span class="cms-list__block" />
              <span class="cms-list__block" />
              <span class="cms-list__block" />
            </span>
            <span class="cms-list__block cms-list__block--text" />
          </router-link>

          <div class="cms-list__info">
            <div class="cms-list__name">
              <mt-text size="xs" weight="semibold">
                <mt-icon
                  v-if="layout.locked"
                  name="regular-lock"
                  size="var(--scale-size-12)"
                  :aria-label="t('cms.locked')"
                />
                {{ layout.name }}
              </mt-text>
              <mt-text size="2xs" color="color-text-secondary-default">
                {{ t(`cms.types.${layout.type}`) }} ·
                {{ format.relativeTime(layout.updatedAt) }}
              </mt-text>
            </div>

            <mt-dropdown-menu-root>
              <mt-dropdown-menu-trigger as-child>
                <mt-button
                  variant="tertiary"
                  size="small"
                  square
                  :aria-label="t('grid.rowActions')"
                >
                  <mt-icon
                    name="solid-ellipsis-h-s"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </mt-button>
              </mt-dropdown-menu-trigger>
              <mt-dropdown-menu-portal>
                <mt-action-menu>
                  <mt-action-menu-item icon="regular-pencil-s">
                    {{ t("common.edit") }}
                  </mt-action-menu-item>
                  <mt-action-menu-item icon="regular-duplicate">
                    {{ t("common.duplicate") }}
                  </mt-action-menu-item>
                  <mt-action-menu-item
                    icon="regular-trash"
                    variant="critical"
                    :disabled="layout.locked"
                  >
                    {{ t("common.delete") }}
                  </mt-action-menu-item>
                </mt-action-menu>
              </mt-dropdown-menu-portal>
            </mt-dropdown-menu-root>
          </div>
        </li>
      </ul>
    </div>
  </mt-page>
</template>

<style scoped>
.cms-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
}

.cms-list__toolbar > :first-child {
  flex: 1 1 28rem;
  min-width: 0;
}

.cms-list__search {
  width: 16rem;
}

.cms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: var(--scale-size-24);
  margin: 0;
  padding: 0;
  list-style: none;
}

.cms-list__item {
  overflow: hidden;
  background-color: var(--color-elevation-surface-raised, var(--color-elevation-surface-default));
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
}

.cms-list__preview {
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
  aspect-ratio: 4 / 3;
  align-content: start;
  background-color: var(--color-background-secondary-default);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.cms-list__preview:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(var(--scale-size-2) * -1);
}

.cms-list__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--scale-size-8);
}

.cms-list__block {
  height: var(--scale-size-40);
  background-color: var(--color-elevation-surface-default);
  border-radius: var(--border-radius-xs);
}

.cms-list__block--hero {
  height: var(--scale-size-64);
}

.cms-list__block--text {
  height: var(--scale-size-16);
  width: 60%;
}

.cms-list__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
  padding: var(--scale-size-12) var(--scale-size-16);
}

.cms-list__name {
  display: grid;
  gap: var(--scale-size-2);
  min-width: 0;
}
</style>
