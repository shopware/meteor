import type { Ref, UnwrapRef } from 'vue';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { get, subscribe, update } from '../index';

export function useDataset<TData>(
  id: string,
  options?: {
    selectors?: string[],
  },
): {
  data: Ref<UnwrapRef<TData> | null>,
  isReady: Ref<boolean>,
  ready: Promise<void>,
} {
  const data = ref<TData | null>(null) as Ref<UnwrapRef<TData> | null>;
  const isReady = ref(false);

  let isUpdatingFromRemote = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe: () => void = () => {};

  const ready = get({
    id,
    selectors: options?.selectors,
  })
    .then(async (initialData) => {
      if (initialData !== null && initialData !== undefined) {
        isUpdatingFromRemote = true;
        data.value = initialData as UnwrapRef<TData>;
        await nextTick();
        isUpdatingFromRemote = false;
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {
      // A catch is needed because get() rejects if no data is available yet
    })
    .finally(() => {
      isReady.value = true;
    });

  const stopWatch = watch(data, (newValue) => {
    if (isUpdatingFromRemote || newValue === null) {
      return;
    }

    void update({
      id,
      data: newValue,
    });
  }, { deep: true });

  unsubscribe = subscribe(
    id,
    async (payload: { data: unknown }) => {
      isUpdatingFromRemote = true;
      data.value = payload.data as UnwrapRef<TData>;
      await nextTick();
      isUpdatingFromRemote = false;
    },
    { selectors: options?.selectors },
  ) as () => void;

  onBeforeUnmount(() => {
    stopWatch();
    unsubscribe();
  });

  return {
    data,
    isReady,
    ready,
  };
}
