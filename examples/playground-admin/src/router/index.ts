import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "../i18n";

declare module "vue-router" {
  interface RouteMeta {
    /** The i18n key of the page title. */
    title?: string;
    /** The i18n key of a section's breadcrumb label, set on the parent of its pages. */
    breadcrumb?: string;
    /**
     * The icon of a section, an icon kit name without its variant. Its pages inherit it, and the
     * breadcrumb shows it in front of the first item.
     */
    icon?: string;
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { title: "nav.dashboard", icon: "dashboard" },
    },
    {
      path: "/orders",
      meta: { breadcrumb: "nav.orders", icon: "shopping-bag" },
      children: [
        {
          path: "",
          name: "order-list",
          component: () => import("../views/OrderListView.vue"),
          meta: { title: "nav.orders" },
        },
        {
          path: ":id",
          name: "order-detail",
          component: () => import("../views/OrderDetailView.vue"),
          meta: { title: "nav.orders" },
        },
      ],
    },
    {
      path: "/products",
      meta: { breadcrumb: "nav.products", icon: "products" },
      children: [
        {
          path: "",
          name: "product-list",
          component: () => import("../views/ProductListView.vue"),
          meta: { title: "nav.products" },
        },
        {
          path: "create",
          name: "product-create",
          component: () => import("../views/ProductDetailView.vue"),
          meta: { title: "products.newTitle" },
        },
        {
          path: ":id",
          name: "product-detail",
          component: () => import("../views/ProductDetailView.vue"),
          meta: { title: "nav.products" },
        },
      ],
    },
    {
      path: "/categories",
      meta: { breadcrumb: "nav.categories", icon: "folder" },
      children: [
        {
          // The main categories without an id, and a category with its subcategories with one.
          path: ":id?",
          name: "category",
          component: () => import("../views/CategoryView.vue"),
          meta: { title: "nav.categories" },
        },
      ],
    },
    {
      path: "/cms",
      name: "cms",
      component: () => import("../views/CmsView.vue"),
      // A full-screen editor: the shell hides its regions before the page renders.
      meta: {
        title: "nav.cms",
        icon: "image-text",
        mtAppRegions: { header: false, navigation: false, sidebar: false },
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { title: "nav.settings", icon: "cog" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: { title: "notFound.title" },
    },
  ],
});

/** Shows the page in the browser tab. The shell announces the new title to screen readers. */
function updateTitle() {
  const { t } = i18n.global;
  const page = router.currentRoute.value.meta.title;

  document.title = page ? `${t(page)} · ${t("app.title")}` : t("app.title");
}

router.afterEach(updateTitle);
watch(i18n.global.locale, updateTitle);
