import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "../i18n";

declare module "vue-router" {
  interface RouteMeta {
    /** The i18n key of the page title, shown in the browser tab. */
    title?: string;
    /**
     * The i18n key of the label and the icon of the navigation panel, for a route with its own
     * `navigation` view. Other routes show the page tree.
     */
    navigation?: { label: string; icon: string };
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { title: "home.title", mtAppRegions: { navigation: false } },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { title: "settings.title", mtAppRegions: { navigation: false } },
    },
    {
      path: "/editor",
      name: "editor",
      components: {
        default: () => import("../views/EditorView.vue"),
        navigation: () => import("../components/EditorLayoutPicker.vue"),
      },
      meta: {
        title: "editor.title",
        navigation: { label: "editor.layouts", icon: "regular-layout" },
      },
    },
    {
      path: "/editor/full-screen",
      name: "editor-full-screen",
      component: () => import("../views/EditorView.vue"),
      props: { fullScreen: true },
      // The shell hides its regions before the page renders.
      meta: {
        title: "editor.title",
        mtAppRegions: { header: false, navigation: false, sidebar: false },
      },
    },
    {
      path: "/copilot",
      name: "copilot",
      component: () => import("../views/CopilotView.vue"),
      // The page shows the conversation, so the sidebar would only repeat it.
      meta: { title: "copilot.title", mtAppRegions: { sidebar: false } },
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
