import type { Plugin } from "vue";
import DeviceHelper from "./_internal/device-helper.service";

export const DeviceHelperPlugin: Plugin = {
  install(app) {
    const deviceHelper = new DeviceHelper();

    app.config.globalProperties.$device = deviceHelper;
    app.mixin({
      unmounted() {
        this.$device.removeResizeListener(this);
      },
    });

    return true;
  },
};
