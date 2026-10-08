import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "../i18n";

declare module "vue-router" {
  interface RouteMeta {
    /** The i18n key of the page title. */
    title?: string;
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { title: "nav.dashboard" },
    },
    {
      path: "/cms",
      name: "cms",
      component: () => import("../views/CmsView.vue"),
      // A full-screen editor: the shell hides its regions before the page renders.
      meta: {
        title: "nav.cms",
        mtAppRegions: { header: false, navigation: false, sidebar: false },
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { title: "nav.settings" },
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
