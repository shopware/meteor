import { ref } from "vue";
import { useAppLoading } from "@shopware-ag/meteor-component-library";

/** How long the mock server takes to answer, so the loading states show. */
const LATENCY = 300;

/** Copies the data the way JSON over HTTP would, so views never hold the server's objects. */
export function transfer<Value>(value: Value): Value {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

/**
 * Sends a request to the mock server: it waits like a network round trip and reports the loading
 * to the shell, which shows its loading bar meanwhile.
 */
export function useRequest() {
  const pendingRequests = ref(0);

  useAppLoading(() => pendingRequests.value > 0);

  async function request<Result>(call: () => Result): Promise<Result> {
    pendingRequests.value += 1;

    try {
      await new Promise((resolve) => setTimeout(resolve, LATENCY));

      return transfer(call());
    } finally {
      pendingRequests.value -= 1;
    }
  }

  return { request };
}
