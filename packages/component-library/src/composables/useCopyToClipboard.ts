import { readonly, ref, shallowRef, type Ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";

/**
 * The state of the last copy attempt. It returns to `"idle"` after the reset delay.
 */
export type CopyStatus = "idle" | "copied" | "failed";

export interface UseCopyToClipboardOptions {
  /**
   * Time in milliseconds after which `status` returns to `"idle"`.
   *
   * @default 2000
   */
  resetDelayInMs?: number;
}

export interface UseCopyToClipboardReturn {
  /** The state of the last copy attempt. */
  status: Readonly<Ref<CopyStatus>>;
  /** The error of the last failed copy attempt, or `null`. */
  error: Readonly<Ref<unknown>>;
  /** Writes `value` to the clipboard. Resolves to `true` on success and never rejects. */
  copy: (value: string) => Promise<boolean>;
}

/**
 * Copies text to the clipboard through the Clipboard API and tracks whether
 * the last attempt succeeded, so components can show short-lived feedback.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { resetDelayInMs = 2000 } = options;

  const status = ref<CopyStatus>("idle");
  const error = shallowRef<unknown>(null);

  const resetTimer = useTimeoutFn(
    () => {
      status.value = "idle";
    },
    resetDelayInMs,
    { immediate: false },
  );

  async function copy(value: string) {
    resetTimer.stop();

    try {
      // The Clipboard API only exists in secure contexts
      if (!navigator.clipboard) {
        throw new Error("The Clipboard API is not available.");
      }

      await navigator.clipboard.writeText(value);
      status.value = "copied";
      error.value = null;
    } catch (e) {
      status.value = "failed";
      error.value = e;
    }

    resetTimer.start();
    return status.value === "copied";
  }

  return {
    status: readonly(status),
    error: readonly(error),
    copy,
  };
}
