import { createApp, defineAsyncComponent } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
import "@shopware-ag/meteor-component-library/styles.css";

// watch for height changes
location.startAutoResizer();

// start app views
const app = createApp({
  data() {
    return { location };
  },
  components: {
    // ui/main-module/add-main-module
    UiMainModuleAddMainModule: defineAsyncComponent(
      () => import("./views/ui/main-module/add-main-module")
    ),
    // ui/menu-item/
    UiMenuItemAddMenuItem: defineAsyncComponent(
      () => import("./views/ui/menu-item/add-menu-item")
    ),
    UiMenuItemAddMenuItemWithSearchBar: defineAsyncComponent(
      () => import("./views/ui/menu-item/add-menu-item-with-searchbar")
    ),
    // ui/modals
    UiModals: defineAsyncComponent(() => import("./views/ui/modals/modals")),
    UiModalsModalContent: defineAsyncComponent(
      () => import("./views/ui/modals/modal-content")
    ),
    // location/general
    LocationIndex: defineAsyncComponent(() => import("./views/location/index")),
    CardTab1: defineAsyncComponent(() => import("./views/card-tabs/tab-1")),
    CardTab2: defineAsyncComponent(() => import("./views/card-tabs/tab-2")),
    // data/dataset
    DataDataset: defineAsyncComponent(() => import("./views/data/dataset")),
  },
  template: `
        <LocationIndex v-if="location.is('location-index')"></LocationIndex>
        <CardTab1 v-else-if="location.is('card-tab-1')"></CardTab1>
        <CardTab2 v-else-if="location.is('card-tab-2')"></CardTab2>
        <UiModals v-else-if="location.is('ui-modals')"></UiModals>
        <DataDataset v-else-if="location.is('data-dataset')"></DataDataset>
        <UiModalsModalContent v-else-if="location.is('ui-modals-modal-content')"></UiModalsModalContent>
        <UiMainModuleAddMainModule v-else-if="location.is('ui-main-module-add-main-module')"></UiMainModuleAddMainModule>
        <UiMenuItemAddMenuItem v-else-if="location.is('ui-menu-item-add-menu-item')"></UiMenuItemAddMenuItem>
        <UiMenuItemAddMenuItemWithSearchBar v-else-if="location.is('ui-menu-item-add-menu-item-with-searchbar')"></UiMenuItemAddMenuItemWithSearchBar>
    `,
});

// Hack to fake i18n
app.config.globalProperties.$tc = (s) => s;
app.config.globalProperties.$t = (s) => s;

app.mount("#app");
