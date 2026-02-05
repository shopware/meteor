import { createId } from "@/utils/id";
import { ref, reactive, readonly, type Ref } from "vue";

export interface Snackbar {
  id: string;
  message: string;
  variant?: "success" | "error" | "warning" | "progress";
  icon?: string;
  link?: {
    text: string;
    url: string;
  };
  duration?: number;
  progressPercentage?: number;
  uploadState?: "success" | "error";
  successMessage?: string;
  errorMessage?: string;
}

// Global snackbars state
const globalSnackbars = ref<Snackbar[]>([]);

export function useSnackbar() {
  function addSnackbar(snackbarData: Omit<Snackbar, "id">) {
    const snackbar = reactive({
      id: createId(),
      duration: 5000,
      ...snackbarData,
    });

    globalSnackbars.value.push(snackbar);

    return snackbar;
  }

  function removeSnackbar(id: string) {
    const index = globalSnackbars.value.findIndex((s) => s.id === id);
    if (index > -1) {
      globalSnackbars.value.splice(index, 1);
    }
  }

  function clearSnackbars() {
    globalSnackbars.value = [];
  }

  return {
    snackbars: readonly(globalSnackbars) as Ref<Snackbar[]>,
    addSnackbar,
    removeSnackbar,
    clearSnackbars,
  };
}
