import { watch } from "vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import type { ModuleKey } from "../modules";
import {
  searchTypes,
  type SearchType,
} from "../composables/useGlobalSearch";
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
    /** The key of a module page in `src/modules.ts`, or of an empty module. */
    module?: string;
    /** The type the top bar's search looks for on the pages of a module. */
    search?: SearchType;
    /** `false` hides the top bar, for full-screen views. */
    topBar?: boolean;
  }
}

/**
 * A list page of a module that the playground shows with mock rows only, such as the reviews. Its
 * columns and rows are in `src/modules.ts`, under the same key as its label in `nav`.
 */
function moduleList(
  module: ModuleKey,
  icon: string,
  path = `/${module}`,
): RouteRecordRaw {
  return {
    path,
    name: module,
    component: () => import("../views/ModuleListView.vue"),
    meta: {
      title: `nav.${module}`,
      icon,
      module,
      search: searchTypes.find((type) => type === module),
    },
  };
}

/** A module the playground leaves empty, such as the media. */
function modulePlaceholder(
  module: string,
  icon: string,
  path = `/${module}`,
): RouteRecordRaw {
  return {
    path,
    name: module,
    component: () => import("../views/ModulePlaceholderView.vue"),
    meta: { title: `nav.${module}`, icon, module },
  };
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
      path: "/products",
      meta: { search: "products", breadcrumb: "nav.products", icon: "products" },
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
    moduleList("reviews", "products"),
    {
      path: "/categories",
      meta: { search: "categories", breadcrumb: "nav.categories", icon: "products" },
      children: [
        {
          // The tree without a selection without an id, and the selected category with one.
          path: ":id?",
          name: "category",
          component: () => import("../views/CategoryView.vue"),
          meta: { title: "nav.categories" },
        },
      ],
    },
    moduleList("productStreams", "products", "/product-streams"),
    moduleList("properties", "products"),
    moduleList("manufacturers", "products"),
    {
      path: "/orders",
      meta: { search: "orders", breadcrumb: "nav.orders", icon: "shopping-bag" },
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
      path: "/customers",
      meta: { search: "customers", breadcrumb: "nav.customers", icon: "users" },
      children: [
        {
          path: "",
          name: "customer-list",
          component: () => import("../views/CustomerListView.vue"),
          meta: { title: "nav.customers" },
        },
        {
          path: ":id",
          name: "customer-detail",
          component: () => import("../views/CustomerDetailView.vue"),
          meta: { title: "nav.customers" },
        },
      ],
    },
    {
      path: "/cms",
      meta: { search: "cms", breadcrumb: "nav.cms", icon: "image-text" },
      children: [
        {
          path: "",
          name: "cms-list",
          component: () => import("../views/CmsListView.vue"),
          meta: { title: "nav.cms" },
        },
        {
          path: ":id",
          name: "cms",
          component: () => import("../views/CmsView.vue"),
          // A full-screen editor: the shell hides its regions before the page renders.
          meta: {
            title: "nav.cms",
            topBar: false,
            mtAppRegions: { header: false, navigation: false, sidebar: false },
          },
        },
      ],
    },
    modulePlaceholder("media", "image-text"),
    modulePlaceholder("themes", "image-text"),
    moduleList("promotions", "megaphone"),
    moduleList("newsletter", "megaphone", "/newsletter-recipients"),
    moduleList("rules", "rule"),
    moduleList("flows", "rule"),
    moduleList("myExtensions", "plug", "/extensions"),
    {
      path: "/sales-channels/:id",
      name: "sales-channel",
      component: () => import("../views/ModulePlaceholderView.vue"),
      meta: { title: "nav.salesChannels", icon: "storefront", module: "salesChannel" },
    },
    modulePlaceholder("store", "plug"),
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { title: "nav.settings", icon: "cog" },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      meta: { title: "profile.title", icon: "user" },
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
