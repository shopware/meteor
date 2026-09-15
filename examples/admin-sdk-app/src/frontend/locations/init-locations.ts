import { createApp, h, defineAsyncComponent } from "vue";
import { createI18n } from "vue-i18n";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import {
  createMeteorI18nPlugin,
  createVueI18nAdapter,
} from "@shopware-ag/meteor-component-library";
import { location, context } from "@shopware-ag/meteor-admin-sdk";

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

async function bootstrap(): Promise<void> {
  // Seed the app's vue-i18n with the host admin's UI locale BEFORE mounting (avoids a
  // flash of the wrong language) and follow later switches pushed over the Admin SDK —
  // the canonical i18n setup for an iframe app.
  const { locale, fallbackLocale } = await context.getLocale();

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale,
    // Widened so vue-i18n accepts any admin locale (en-GB, de-DE, ...), not just "en".
    messages: {
      en: {
        hello: "Hello world!",
      },
    } as Record<string, { hello: string }>,
  });

  void context.subscribeLocale(({ locale: nextLocale, fallbackLocale: nextFallbackLocale }) => {
    i18n.global.locale.value = nextLocale;
    i18n.global.fallbackLocale.value = nextFallbackLocale;
  });

  const app = createApp({
    // @ts-expect-error -- TS does not know about the location object
    render: () => h(locations[location.get()]),
  });

  app.use(i18n);

  // Let Meteor's components follow this app's vue-i18n locale and snippet overrides.
  app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));

  app.mount("#app");
}

void bootstrap();
