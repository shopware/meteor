import { inject, provide } from "vue";

export type FutureFlags = {
  removeCardWidth: boolean;
};

const defaultFutureFlags: FutureFlags = {
  removeCardWidth: false,
};

export const futureFlagsInjectionKey = Symbol("mt-future-flags");

export function provideFutureFlags(flags: FutureFlags | undefined) {
  provide(futureFlagsInjectionKey, flags ?? defaultFutureFlags);
}

export function useFutureFlags(): FutureFlags {
  return inject(futureFlagsInjectionKey, defaultFutureFlags);
}
