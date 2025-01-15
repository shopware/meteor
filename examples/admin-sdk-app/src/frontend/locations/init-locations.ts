import { createApp, h, defineAsyncComponent } from "vue";
import { createI18n } from "vue-i18n";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import { location } from "@shopware-ag/meteor-admin-sdk";

// register all components for the location
const locations = {
  "ex-product-extension-example-resize": defineAsyncComponent(
    () => import("./ex-product-extension-example-resize.vue")
  ),
  "ex-product-extension-example-data": defineAsyncComponent(
    () => import("./ex-product-extension-example-data.vue")
  ),
  "ex-chart-card-before": defineAsyncComponent(
    () => import("./ex-chart-card-before.vue")
  ),
  "ex-meteor-admin-sdk-example-module": defineAsyncComponent(
    () =>
      import("./module/example-module/ex-meteor-admin-sdk-example-module.vue")
  ),
  "ex-dailymotion-config": defineAsyncComponent(
    () => import("../cms/ex-dailymotion/ex-dailymotion-config.vue")
  ),
  "ex-dailymotion-preview": defineAsyncComponent(
    () => import("../cms/ex-dailymotion/ex-dailymotion-preview.vue")
  ),
  "ex-dailymotion-element": defineAsyncComponent(
    () => import("../cms/ex-dailymotion/ex-dailymotion-element.vue")
  ),
};

const app = createApp({
  // @ts-expect-error
  render: () => h(locations[location.get()]),
});

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      hello: "Hello world!",
    },
  },
});

app.use(i18n);

app.mount("#app");
