import { readonly, shallowRef } from "vue";

export interface ConfirmOptions {
  title: string;
  text: string;
  confirmLabel: string;
  cancelLabel: string;
  /** `critical` for confirmations that lose data, such as discarding changes. */
  variant?: "primary" | "critical";
}

interface ConfirmRequest extends ConfirmOptions {
  resolve(confirmed: boolean): void;
}

/** The open confirmation, shared by the whole app and shown by `AppConfirmModal`. */
const request = shallowRef<ConfirmRequest | null>(null);

function answer(confirmed: boolean) {
  const current = request.value;

  request.value = null;
  current?.resolve(confirmed);
}

/** Asks the user to confirm, in the app's confirm modal. */
export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    // A new question replaces one that is still open, which counts as not confirmed.
    answer(false);

    return new Promise((resolve) => {
      request.value = { ...options, resolve };
    });
  }

  return { confirm };
}

/** The open confirmation and its answer, for the modal that shows it. */
export function useConfirmHost() {
  return { request: readonly(request), answer };
}
