import { _useSharedState } from './useSharedState';
import type { UnwrapRef, Ref } from 'vue';
import { computed, watch } from 'vue';

export function useAsyncSharedState<INITIAL_VALUE>(key: string, initalValue: INITIAL_VALUE): {
  state: UnwrapRef<INITIAL_VALUE>,
  isReady: Ref<boolean>,
  ready: Promise<void>,
} {
  const result = _useSharedState(key, initalValue);
  const state = computed({
    get: () => result.state.value,
    set: (value) => {
      result.state.value = value;
    },
  });

  return {
    state: state,
    isReady: result.isReady,
    ready: result.ready,
  };
}