import type { Plugin } from "vue";
// @ts-expect-error
import DeviceHelper from "../helper/device.helper";

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
