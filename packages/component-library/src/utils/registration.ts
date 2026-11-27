import { getCurrentInstance, onActivated, onDeactivated, onScopeDispose } from "vue";

/**
 * Keeps a registration while the calling component or effect scope is alive and not deactivated by
 * `<KeepAlive>`. `register` returns the function that ends the registration.
 */
export function useRegistration(register: () => () => void): void {
  let release: (() => void) | undefined = register();

  if (getCurrentInstance()) {
    onDeactivated(() => {
      release?.();
      release = undefined;
    });
    onActivated(() => {
      release ??= register();
    });
  }

  onScopeDispose(() => release?.());
}
