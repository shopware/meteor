import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { settingsSections } from "../data/settings";
import { templates, workflows } from "../data/workflows";
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
      name: "overview",
      component: () => import("../views/OverviewView.vue"),
      meta: { title: "overview.title" },
    },
    {
      path: "/workflows/:id",
      name: "workflow",
      component: () => import("../views/WorkflowView.vue"),
      props: true,
      // A full-screen editor: the shell hides its header with the navigation before the page renders.
      meta: {
        title: "workflow.title",
        mtAppRegions: { header: false, contentFrame: false },
      },
      // Opens a workflow, or a new one from a template. Unknown ids show the 404 page.
      beforeEnter: (to) =>
        [...workflows, ...templates].some(({ id }) => id === to.params.id) || {
          name: "not-found",
          params: { pathMatch: to.path.slice(1).split("/") },
          query: to.query,
          hash: to.hash,
        },
    },
    {
      // Groups the pages of the marketplace, and opens the first of them.
      path: "/marketplace",
      children: [
        { path: "", redirect: { name: "integrations" } },
        {
          path: "integrations",
          name: "integrations",
          component: () => import("../views/IntegrationsView.vue"),
          meta: { title: "integrations.title" },
        },
        {
          path: "templates",
          name: "templates",
          component: () => import("../views/TemplatesView.vue"),
          meta: { title: "templates.title" },
        },
      ],
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { title: "settings.title" },
      // The settings open with their first section.
      redirect: { name: "settings-section", params: { section: "general" } },
      children: [
        {
          // Only known sections match, others show the 404 page.
          path: `:section(${settingsSections.map(({ id }) => id).join("|")})`,
          name: "settings-section",
          component: () => import("../views/SettingsSectionView.vue"),
          props: true,
        },
      ],
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
