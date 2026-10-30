import { shallowReactive } from "vue";
import type { MtAppPanel } from "./useApp";

/**
 * The panels whose trigger a page shows, such as `mt-page`. The shell's header shows a panel's
 * trigger only while no page shows it.
 */
export function createAppTriggers() {
  const registrations = shallowReactive(new Map<symbol, () => MtAppPanel>());

  function hasPageTrigger(panel: MtAppPanel) {
    return Array.from(registrations.values()).some((registered) => registered() === panel);
  }

  function registerTrigger(panel: () => MtAppPanel) {
    const id = Symbol("mt-app-panel-trigger");
    registrations.set(id, panel);

    return () => {
      registrations.delete(id);
    };
  }

  return { hasPageTrigger, registerTrigger };
}
