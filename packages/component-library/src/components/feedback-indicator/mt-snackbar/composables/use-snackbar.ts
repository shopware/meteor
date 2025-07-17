import { ref, type Ref } from "vue";

export interface Snackbar {
  id: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  icon?: string;
  link?: {
    text: string;
    url: string;
  };
  duration?: number;
}

// Global snackbars state
const globalSnackbars = ref<Snackbar[]>([]);

export function useSnackbar() {
  function addSnackbar(snackbarData: Omit<Snackbar, "id">) {
    const id = `snackbar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const snackbar: Snackbar = {
      id,
      duration: 5000,
      ...snackbarData,
    };

    globalSnackbars.value.unshift(snackbar);
  }

  function removeSnackbar(id: string) {
    const index = globalSnackbars.value.findIndex((s) => s.id === id);
    if (index > -1) {
      globalSnackbars.value.splice(index, 1);
    }
  }

  return {
    snackbars: globalSnackbars as Ref<Snackbar[]>,
    addSnackbar,
    removeSnackbar,
  };
}
