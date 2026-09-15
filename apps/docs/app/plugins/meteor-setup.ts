import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";

/**
 * Host-app setup the meteor component library expects, mirroring the Storybook
 * preview decorators (Meteor i18n plugin + DeviceHelperPlugin):
 * - the Meteor i18n plugin serves the components' bundled English snippets
 *   (the docs render in English; no host adapter needed).
 * - several components read `this.$device` in mounted to register resize
 *   listeners.
 *
 * The i18n plugin is installed on both server and client; the device helper is
 * client only because it touches window and its listeners only run after mount.
 */

type ResizeRegistration = {
  listener: (event: UIEvent) => void;
  scope?: unknown;
  component?: unknown;
};

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait: number,
): T {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  } as T;
}

/** Faithful, dependency-free reimplementation of the library's DeviceHelper. */
class DeviceHelper {
  private listeners: ResizeRegistration[] = [];

  constructor() {
    window.addEventListener(
      "resize",
      debounce((event: UIEvent) => {
        this.listeners.forEach((entry) =>
          entry.listener.call(entry.scope ?? window, event),
        );
      }, 100),
    );
  }

  onResize({ listener, scope, component }: ResizeRegistration) {
    this.listeners.push({ listener, scope: scope ?? window, component });
    return this.listeners.length - 1;
  }

  removeResizeListener(component: unknown) {
    this.listeners = this.listeners.filter(
      (entry) => entry.component !== component,
    );
    return true;
  }

  getUserAgent() {
    return window.navigator.userAgent;
  }

  getViewportWidth() {
    return window.innerWidth;
  }

  getViewportHeight() {
    return window.innerHeight;
  }

  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }

  getScreenWidth() {
    return window.screen.width;
  }

  getScreenHeight() {
    return window.screen.height;
  }

  getScreenOrientation() {
    return window.screen.orientation;
  }

  getBrowserLanguage() {
    return window.navigator.language;
  }

  getPlatform() {
    return window.navigator.platform;
  }

  getSystemKey() {
    return this.getPlatform().indexOf("Mac") > -1 ? "CTRL" : "ALT";
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createMeteorI18nPlugin());

  if (import.meta.client) {
    const deviceHelper = new DeviceHelper();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nuxtApp.vueApp.config.globalProperties as any).$device = deviceHelper;

    nuxtApp.vueApp.mixin({
      unmounted() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).$device?.removeResizeListener(this);
      },
    });
  }
});
