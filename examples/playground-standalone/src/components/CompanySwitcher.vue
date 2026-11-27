<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtText,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

// Example companies without real data behind them.
const companies = [
  { id: "alpine-outdoor", name: "Alpine Outdoor GmbH" },
  { id: "harbor-home", name: "Harbor Home Ltd." },
];

const currentId = ref(companies[0]!.id);
const current = computed(
  () => companies.find((company) => company.id === currentId.value)!,
);

const companiesLabelId = useId();
</script>

<template>
  <div class="company-switcher">
    <mt-dropdown-menu-root>
      <mt-dropdown-menu-trigger as-child>
        <!-- Looks like mt-brand with the Nexus logo. mt-brand itself would get the extra padding
             mt-app-sidebar gives it in the mobile drawer. -->
        <button type="button" class="company-switcher__trigger">
          <span class="company-switcher__logo">
            <mt-icon
              name="solid-shopware-nexus"
              size="var(--scale-size-22)"
              decorative
            />
          </span>

          <mt-text
            as="span"
            size="xs"
            weight="semibold"
            class="company-switcher__name"
          >
            {{ current.name }}
          </mt-text>

          <span class="company-switcher__chevron">
            <mt-icon
              name="regular-chevron-down-xs"
              size="var(--scale-size-8)"
              decorative
            />
          </span>
        </button>
      </mt-dropdown-menu-trigger>

      <mt-dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group :aria-labelledby="companiesLabelId">
            <mt-text
              :id="companiesLabelId"
              as="div"
              size="xs"
              weight="regular"
              color="color-text-secondary-default"
              class="company-switcher__label"
            >
              {{ t("companySwitcher.companies") }}
            </mt-text>

            <mt-action-menu-item
              v-for="company in companies"
              :key="company.id"
              role="menuitemradio"
              :aria-checked="company.id === currentId"
              @select="currentId = company.id"
            >
              {{ company.name }}
              <mt-icon
                v-if="company.id === currentId"
                name="regular-checkmark-xs"
                size="var(--scale-size-12)"
                class="company-switcher__check"
                decorative
              />
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item>
              {{ t("companySwitcher.manage") }}
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item>
              {{ t("companySwitcher.create") }}
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
      </mt-dropdown-menu-portal>
    </mt-dropdown-menu-root>
  </div>
</template>

<style scoped>
/* As wide as its content in the header, as wide as the drawer in the mobile layout. */
.company-switcher {
  flex: 1 1 auto;
  min-width: 0;
}

/* The states are those of the mt-user-menu trigger. */
.company-switcher__trigger {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  width: 100%;
  padding-block: var(--scale-size-4);
  padding-inline: var(--scale-size-4) var(--scale-size-8);
  border: none;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-primary-default);
  text-align: start;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}

.company-switcher__trigger:hover,
.company-switcher__trigger[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.company-switcher__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.company-switcher__logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-36);
  height: var(--scale-size-36);
  border-radius: var(--border-radius-m);
  background: var(--color-icon-brand-default);
  color: var(--color-static-white);
}

.company-switcher__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.company-switcher__chevron {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-20);
  height: var(--scale-size-20);
  color: var(--color-icon-primary-default);
}

/* Like the section headers of mt-nav, with the text in line with the items. */
.company-switcher__label {
  display: flex;
  align-items: center;
  height: var(--scale-size-24);
  margin-block-end: var(--scale-size-4);
  padding-inline: var(--scale-size-10);
}

.company-switcher__check {
  margin-inline-start: auto;
  color: var(--color-icon-primary-default);
}
</style>
