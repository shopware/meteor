import { useClipboard } from "@vueuse/core";

/**
 * Copy text to the clipboard with a consistent success/failure toast. Shared by
 * the "click to copy" affordances in the token/icon browsers so they all behave
 * (and report errors) the same way.
 *
 * @param value text to copy
 * @param label what to name in the toast (defaults to the copied value)
 */
export function useCopyToClipboard() {
  const { copy: writeToClipboard, copied, isSupported } = useClipboard();
  const toast = useToast();

  async function copy(value: string, label?: string) {
    const shown = label ?? value;
    try {
      await writeToClipboard(value);
      toast.add({
        title: `Copied ${shown}`,
        icon: "i-lucide-check",
        color: "success",
      });
    } catch {
      toast.add({
        title: `Couldn't copy ${shown}`,
        icon: "i-lucide-x",
        color: "error",
      });
    }
  }

  return { copy, copied, isSupported };
}
