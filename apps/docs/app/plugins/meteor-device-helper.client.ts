type ResizeListener = {
  listener: (event?: UIEvent) => void;
  scope: unknown;
  component: unknown;
};

function createDeviceHelper() {
  const listeners: ResizeListener[] = [];
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;

  function onWindowResize(event: UIEvent) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      listeners.forEach((l) => l.listener.call(l.scope, event));
    }, 100);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("resize", onWindowResize);
  }

  return {
    onResize({ listener, scope, component }: ResizeListener) {
      listeners.push({ listener, scope: scope ?? window, component });
    },
    removeResizeListener(component: unknown) {
      const idx = listeners.findIndex((l) => l.component === component);
      if (idx !== -1) listeners.splice(idx, 1);
    },
  };
}

export default defineNuxtPlugin(({ vueApp }) => {
  const deviceHelper = createDeviceHelper();

  vueApp.config.globalProperties.$device = deviceHelper;

  vueApp.mixin({
    unmounted() {
      this.$device?.removeResizeListener(this);
    },
  });
});
