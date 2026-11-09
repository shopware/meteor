import { computed, onMounted, onUnmounted, ref } from "vue";

const snackbarHosts = ref<symbol[]>([]);

/** Registers a mounted `mt-snackbar`. Only the first registered host renders the notifications. */
export function useSnackbarHost() {
  const id = Symbol("mt-snackbar");

  onMounted(() => {
    snackbarHosts.value.push(id);
  });

  onUnmounted(() => {
    snackbarHosts.value = snackbarHosts.value.filter((host) => host !== id);
  });

  return computed(() => snackbarHosts.value[0] === id);
}
