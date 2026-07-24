import { debounce } from "@/utils/debounce";

interface ResizeListenerConfig {
  listener: (event: Event) => void;
  scope?: unknown;
  component?: unknown;
}

/**
 * The DeviceHelper provides methods to get device and browser information like the current viewport size.
 * The helper methods can be accessed with "this.$device" in every Vue component.
 */
export default class DeviceHelper {
  private listeners: ResizeListenerConfig[] = [];

  /**
   * Resize method which will be fired when the user resizes the browser.
   */
  resize = debounce((event: Event): void => {
    this.listeners.forEach((listenerObject) => {
      listenerObject.listener.call(listenerObject.scope, event);
    });
  }, 100);

  constructor() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  /**
   * Registers an event register for the browser "resize" event.
   */
  onResize({ listener, scope, component }: ResizeListenerConfig): number {
    if (!scope) {
      scope = window;
    }

    this.listeners.push({ listener, scope, component });
    return this.listeners.length - 1;
  }

  removeResizeListener(component: unknown): boolean {
    this.listeners = this.listeners.filter(
      (listenerObject) => component !== listenerObject.component,
    );

    return true;
  }

  /**
   * Returns the user agent string.
   */
  getUserAgent(): string {
    return window.navigator.userAgent;
  }

  /**
   * Returns the current viewport width in pixels.
   */
  getViewportWidth(): number {
    return window.innerWidth;
  }

  /**
   * Returns the current viewport height in pixels.
   */
  getViewportHeight(): number {
    return window.innerHeight;
  }

  /**
   * Returns the pixel ratio of the device as a number.
   */
  getDevicePixelRatio(): number {
    return window.devicePixelRatio;
  }

  /**
   * Returns the device screen width in pixels.
   */
  getScreenWidth(): number {
    return window.screen.width;
  }

  /**
   * Returns the device screen height in pixels.
   */
  getScreenHeight(): number {
    return window.screen.height;
  }

  /**
   * Returns information about the screen orientation.
   */
  getScreenOrientation(): ScreenOrientation {
    return window.screen.orientation;
  }

  /**
   * Returns the current browser language as a string.
   */
  getBrowserLanguage(): string {
    return window.navigator.language;
  }

  /**
   * Returns the current platform (e.g. "Win32") as a string.
   */
  getPlatform(): string {
    return window.navigator.platform;
  }

  /**
   * Returns the system-key (e.g. "CTRL") as a string depending of the current operating system.
   */
  getSystemKey(): string {
    return this.getPlatform().indexOf("Mac") > -1 ? "CTRL" : "ALT";
  }
}
