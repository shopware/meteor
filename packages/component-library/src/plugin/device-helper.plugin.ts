import type { Plugin } from "vue";
import DeviceHelper from "./device-helper.service";

const DeviceHelperPlugin: Plugin = {
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

export default DeviceHelperPlugin;
