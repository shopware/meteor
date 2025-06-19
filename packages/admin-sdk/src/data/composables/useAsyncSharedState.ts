import { _useSharedState } from './useSharedState';
import type { UnwrapRef, Ref, WritableComputedRef } from 'vue';
import { computed } from 'vue';

export function useAsyncSharedState<INITIAL_VALUE>(key: string, initialValue: INITIAL_VALUE): {
  state: WritableComputedRef<UnwrapRef<INITIAL_VALUE>>,
  isReady: Ref<boolean>,
  ready: Promise<void>,
} {
  const result = _useSharedState(key, initialValue);
  const state = computed({
    get: () => result.state.value,
    set: (value) => {
      result.state.value = value;
    },
  });

  return {
    state,
    isReady: result.isReady,
    ready: result.ready,
  };
}
