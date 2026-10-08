import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import ProductsView from "../views/ProductsView.vue";
import CmsView from "../views/CmsView.vue";
import SettingsView from "../views/SettingsView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/products", name: "products", component: ProductsView },
    {
      path: "/cms",
      name: "cms",
      component: CmsView,
      // A full-screen editor: the shell hides its regions before the page renders.
      meta: {
        mtAppRegions: { header: false, navigation: false, sidebar: false },
      },
    },
    { path: "/settings", name: "settings", component: SettingsView },
  ],
});
