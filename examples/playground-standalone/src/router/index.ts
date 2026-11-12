import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "../i18n";

declare module "vue-router" {
  interface RouteMeta {
    /** The i18n key of the page title, shown in the browser tab. */
    title?: string;
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { title: "home.title" },
    },
    {
      path: "/automations",
      name: "automations",
      component: () => import("../views/AutomationsView.vue"),
      meta: { title: "automations.title" },
    },
    {
      path: "/integrations",
      name: "integrations",
      component: () => import("../views/IntegrationsView.vue"),
      meta: { title: "integrations.title" },
    },
    {
      path: "/members",
      name: "members",
      component: () => import("../views/MembersView.vue"),
      meta: { title: "members.title" },
    },
    {
      path: "/settings/:section?",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      props: true,
      meta: { title: "settings.title" },
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("../views/EditorView.vue"),
      meta: { title: "editor.title" },
    },
    {
      path: "/editor/full-screen",
      name: "editor-full-screen",
      component: () => import("../views/EditorView.vue"),
      props: { fullScreen: true },
      // The shell hides its regions before the page renders.
      meta: {
        title: "editor.title",
        mtAppRegions: { header: false, sidebar: false },
      },
    },
    {
      path: "/pages/:id",
      name: "page",
      component: () => import("../views/PageView.vue"),
      props: true,
      meta: { title: "page.title" },
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
