<script setup lang="ts">
import { ref } from "vue";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtBrand,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPage,
  MtSearch,
  MtUser,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];

const term = ref("");
</script>

<template>
  <mt-app>
    <template #header>
      <div class="header">
        <!-- The brand opens the menu of the account, so the header needs no user menu. -->
        <mt-dropdown-menu-root>
          <mt-dropdown-menu-trigger as-child>
            <button type="button" class="brand-menu" aria-label="Open the menu">
              <mt-brand title="Custom header" />

              <mt-icon
                name="regular-chevron-down-xs"
                size="var(--scale-size-8)"
                color="var(--color-icon-primary-default)"
                decorative
              />
            </button>
          </mt-dropdown-menu-trigger>

          <mt-dropdown-menu-portal>
            <mt-action-menu>
              <mt-action-menu-group>
                <mt-user
                  name="John Doe"
                  subtitle="john.doe@example.com"
                  class="brand-menu__account"
                />
              </mt-action-menu-group>

              <mt-action-menu-group>
                <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
                <mt-action-menu-item icon="user-plus">Invite members</mt-action-menu-item>
                <mt-action-menu-item icon="question-circle">Help center</mt-action-menu-item>
              </mt-action-menu-group>

              <mt-action-menu-group>
                <mt-action-menu-item icon="sign-out" variant="critical">Log out</mt-action-menu-item>
              </mt-action-menu-group>
            </mt-action-menu>
          </mt-dropdown-menu-portal>
        </mt-dropdown-menu-root>

        <mt-search v-model="term" size="small" placeholder="Search everything" />

        <div class="header__actions">
          <mt-button variant="primary" size="small" class="header__create">
            <template #iconFront="{ size }">
              <mt-icon name="regular-plus-xs" :size="size" decorative />
            </template>
            Create
          </mt-button>

          <mt-button variant="tertiary" size="default" square aria-label="Notifications">
            <template #iconFront>
              <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
            </template>
          </mt-button>
        </div>
      </div>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr minmax(0, 32rem) 1fr;
  align-items: center;
  gap: var(--scale-size-16);
  padding-block: var(--scale-size-8);
  padding-inline: var(--scale-size-4);
}

.brand-menu {
  display: flex;
  justify-self: start;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
  padding: var(--scale-size-4) var(--scale-size-12) var(--scale-size-4) var(--scale-size-4);
  border: none;
  border-radius: var(--border-radius-l);
  color: var(--color-text-primary-default);
  background-color: transparent;
  text-align: start;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}

.brand-menu:hover,
.brand-menu[data-state="open"] {
  background-color: var(--color-interaction-secondary-hover);
}

.brand-menu:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.brand-menu__account {
  padding: var(--scale-size-4) var(--scale-size-8);
}

.header__actions {
  display: flex;
  justify-self: end;
  align-items: center;
  gap: var(--scale-size-4);
}

/* On narrow screens, the search takes the space of the create action. */
@media (width < 800px) {
  .header {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .header__create {
    display: none;
  }
}
</style>
