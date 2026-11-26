<script setup lang="ts">
import { ref } from "vue";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAnnouncement,
  MtApp,
  MtAppSidebar,
  MtBrand,
  MtButton,
  MtPage,
  MtPanel,
  MtUserMenu,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

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

// In your application, keep it closed once people close it, for example with a flag in the
// browser storage. The button in the page only brings it back to try the template again.
const isAnnouncementOpen = ref(true);
</script>

<template>
  <mt-app>
    <!-- The slot empties when the announcement closes, so the shell slides it out. -->
    <template v-if="isAnnouncementOpen" #announcement>
      <mt-announcement variant="attention" icon="tools" closable @close="isAnnouncementOpen = false">
        Planned maintenance on Sunday from 2:00 to 4:00 AM CET.
        <a href="#">Learn more</a>
      </mt-announcement>
    </template>

    <template #navigation>
      <mt-panel label="Navigation" resizable :min-width="200" :max-width="320">
        <mt-app-sidebar :sections="sections">
          <template #start>
            <mt-brand title="Shopware" subtitle="Meteor" />
          </template>

          <template #end>
            <mt-user-menu name="Max Mustermann" subtitle="Administrator">
              <mt-action-menu-group>
                <mt-action-menu-item icon="regular-sign-out" variant="critical">
                  Log out
                </mt-action-menu-item>
              </mt-action-menu-group>
            </mt-user-menu>
          </template>
        </mt-app-sidebar>
      </mt-panel>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <template v-if="!isAnnouncementOpen" #actions>
        <mt-button variant="secondary" size="default" @click="isAnnouncementOpen = true">
          Show announcement
        </mt-button>
      </template>

      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>
