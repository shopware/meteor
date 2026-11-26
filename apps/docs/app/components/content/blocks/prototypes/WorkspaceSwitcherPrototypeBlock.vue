<script setup lang="ts">
import { ref } from "vue";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppSidebar,
  MtBrand,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPage,
  MtPanel,
  MtUser,
  useSnackbar,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// Sample data. Replace it with the shops of the signed-in user.
const shops = [
  { id: "outdoor", name: "Outdoor store", domain: "outdoor.example.com" },
  { id: "home", name: "Home and living", domain: "home.example.com" },
  { id: "kids", name: "Kids world", domain: "kids.example.com" },
];
const shop = ref(shops[0]!);

// The main navigation of the application. Mark the current page with `active`.
const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-dashboard", to: "/", active: true },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "/products" },
          { label: "Categories", to: "/categories" },
        ],
      },
      { label: "Customers", icon: "regular-users", to: "/customers" },
      { label: "Settings", icon: "regular-cog", to: "/settings" },
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];

const { addSnackbar } = useSnackbar();

// Replace it with loading the data of the selected shop.
function switchTo(item: (typeof shops)[number]) {
  shop.value = item;
  addSnackbar({ message: `Switched to ${item.name}` });
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-panel label="Navigation" resizable :min-width="200" :max-width="320">
        <mt-app-sidebar :sections="sections">
          <template #start>
            <missing-feature title="Switcher" class="switcher-note">
              No component for a brand that switches the shop and holds the account. The menu
              below stands in for it.

              <template #stand-in>
                <mt-dropdown-menu-root>
                  <mt-dropdown-menu-trigger as-child>
                    <button type="button" class="switcher" aria-label="Switch shop">
                      <mt-brand :title="shop.name" :subtitle="shop.domain" />
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
                          name="Max Mustermann"
                          subtitle="max.mustermann@example.com"
                          class="switcher__user"
                        />
                      </mt-action-menu-group>

                      <mt-action-menu-group>
                        <mt-action-menu-item
                          v-for="item in shops"
                          :key="item.id"
                          icon="storefront"
                          @select="switchTo(item)"
                        >
                          {{ item.name }}
                          <mt-icon
                            v-if="item.id === shop.id"
                            name="regular-check-circle-s"
                            size="var(--scale-size-14)"
                            color="var(--color-icon-primary-default)"
                            class="switcher__current"
                            aria-label="Current shop"
                          />
                        </mt-action-menu-item>
                        <mt-action-menu-item icon="plus">Add shop</mt-action-menu-item>
                      </mt-action-menu-group>

                      <mt-action-menu-group>
                        <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
                        <mt-action-menu-item icon="question-circle">Help center</mt-action-menu-item>
                      </mt-action-menu-group>

                      <mt-action-menu-group>
                        <mt-action-menu-item icon="sign-out" variant="critical">
                          Log out
                        </mt-action-menu-item>
                      </mt-action-menu-group>
                    </mt-action-menu>
                  </mt-dropdown-menu-portal>
                </mt-dropdown-menu-root>
              </template>
            </missing-feature>
          </template>
        </mt-app-sidebar>
      </mt-panel>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>

<style scoped>
.switcher-note {
  flex: 1;
}

.switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
  width: 100%;
  padding: var(--scale-size-4) var(--scale-size-8) var(--scale-size-4) var(--scale-size-4);
  color: var(--color-text-primary-default);
  text-align: start;
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-l);
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}

.switcher:hover,
.switcher[data-state="open"] {
  background-color: var(--color-interaction-secondary-hover);
}

.switcher:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.switcher__user {
  padding: var(--scale-size-4) var(--scale-size-8);
}

.switcher__current {
  margin-inline-start: auto;
}
</style>
