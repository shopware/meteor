import { shallowReactive } from "vue";
import type { MtAppPanel } from "./useApp";

/**
 * The panels whose trigger a page shows, such as `mt-page`. Each registration lasts until its
 * release function is called, and the shell's header shows a panel's trigger only while no page
 * shows it.
 */
export function createAppTriggers() {
  const registrations = shallowReactive(new Map<symbol, MtAppPanel>());

  /** Whether a page shows the panel's trigger. */
  function isShownByPage(panel: MtAppPanel) {
    return Array.from(registrations.values()).includes(panel);
  }

  function registerTrigger(panel: MtAppPanel) {
    const id = Symbol("mt-app-panel-trigger");
    registrations.set(id, panel);

    return () => {
      registrations.delete(id);
    };
  }

  return { isShownByPage, registerTrigger };
}
