import { createRouter, createWebHistory } from "vue-router";
import PageOne from "./pages/PageOne.vue";
import PageTwo from "./pages/PageTwo.vue";
import SettingsPage from "./pages/SettingsPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "page-one", component: PageOne },
    { path: "/page-two", name: "page-two", component: PageTwo },
    { path: "/settings", name: "settings", component: SettingsPage },
  ],
});
