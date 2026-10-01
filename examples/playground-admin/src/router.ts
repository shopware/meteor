import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import CmsPage from "./pages/CmsPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: DashboardPage },
    { path: "/products", name: "products", component: ProductsPage },
    { path: "/cms", name: "cms", component: CmsPage },
    { path: "/settings", name: "settings", component: SettingsPage },
  ],
});
