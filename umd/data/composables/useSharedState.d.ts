import type { UnwrapRef } from 'vue';
/**
 *
 * @param key - Shared state key
 * @param initalValue - Initial value
 * @returns
 */
export declare function useSharedState<INITIAL_VALUE>(key: string, initalValue: INITIAL_VALUE): {
    value: UnwrapRef<INITIAL_VALUE>;
};
