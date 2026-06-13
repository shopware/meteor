<script setup lang="ts">
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";

const commonUsages = [
  { icon: "tachometer", label: "Dashboard" },
  { icon: "home", label: "Home" },
  { icon: "products", label: "Products" },
  { icon: "variants", label: "Product Variants" },
  { icon: "barcode", label: "SKU / Barcode" },
  { icon: "crossselling", label: "Cross-selling" },
  { icon: "shopping-bag", label: "Orders" },
  { icon: "users", label: "Customers" },
  { icon: "content", label: "Content" },
  { icon: "megaphone", label: "Marketing" },
  { icon: "plug", label: "Extensions" },
  { icon: "cog", label: "Settings" },
  { icon: "storefront", label: "Sales Channels" },
  { icon: "shopping-cart", label: "Shopping cart" },
  { icon: "heart", label: "Wishlist" },
  { icon: "search", label: "Search" },
  { icon: "filter", label: "Filter" },
  { icon: "sort", label: "Sort" },
  { icon: "bulk-edit", label: "Bulk edit" },
  { icon: "eye", label: "Preview" },
  { icon: "sign-in", label: "Login/Signup" },
  { icon: "sign-out", label: "Logout" },
  { icon: "database", label: "Import/Export" },
  { icon: "download", label: "Download / Export" },
  { icon: "upload", label: "Upload / Import" },
  { icon: "rule", label: "Rule Builder" },
  { icon: "flow", label: "Flow Builder" },
  { icon: "sitemap", label: "Categories" },
  { icon: "image", label: "Media" },
  { icon: "folder", label: "Folder" },
  { icon: "file-text", label: "Documents" },
  { icon: "tag", label: "Tags" },
  { icon: "archive", label: "Archive" },
  { icon: "calendar", label: "Date" },
  { icon: "clock", label: "Scheduled / Pending" },
  { icon: "history", label: "History" },
  { icon: "link", label: "Link" },
  { icon: "credit-card", label: "Payment methods" },
  { icon: "discount", label: "Promotions / Discounts" },
  { icon: "truck", label: "Shipping" },
  { icon: "inventory", label: "Stock / Inventory" },
  { icon: "warehouse", label: "Warehouse" },
  { icon: "analytics", label: "Analytics" },
  { icon: "user", label: "Users" },
  { icon: "key", label: "API Key / Credentials" },
  { icon: "tools-alt", label: "Maintenance" },
  { icon: "server", label: "Server / Infrastructure" },
  { icon: "plans", label: "Shopware Plans" },
  { icon: "shopware-nexus", label: "Shopware Nexus" },
  { icon: "shopware-payments", label: "Shopware Payments" },
  { icon: "shopware-intelligence", label: "Shopware Intelligence" },
  { icon: "check-circle", label: "Success" },
  { icon: "exclamation-circle", label: "Error" },
  { icon: "exclamation-triangle", label: "Warning" },
  { icon: "info-circle", label: "Info" },
  { icon: "bell", label: "Notifications" },
  { icon: "chevron-left", label: "Back / Previous" },
  { icon: "chevron-right", label: "Forward / Next" },
  { icon: "external-link", label: "Open in new tab" },
  { icon: "plus", label: "Add / Create" },
  { icon: "pencil-s", label: "Edit" },
  { icon: "minus", label: "Remove" },
  { icon: "trash", label: "Delete" },
  { icon: "duplicate", label: "Duplicate" },
  { icon: "copy", label: "Copy" },
  { icon: "times", label: "Close" },
];
</script>

<template>
  <div class="common-usages">
    <div v-for="usage in commonUsages" :key="usage.icon" class="usage">
      <div class="usage__icon">
        <MtIcon
          :name="usage.icon"
          mode="regular"
          size="var(--scale-size-20)"
          color="var(--color-icon-primary-default)"
          decorative
        />
      </div>
      <div class="usage__meta">
        <strong>{{ usage.label }}</strong>
        <code>{{ usage.icon }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.common-usages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.usage {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.usage__icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-s);
  background: var(--color-background-tertiary-default);
}

.usage__meta {
  display: grid;
  gap: 4px;
  min-width: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.usage__meta code {
  font-size: var(--font-size-2xs);
  color: var(--color-text-secondary-default);
}
</style>
