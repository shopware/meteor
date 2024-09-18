import { inject, provide } from "vue";

const defaultFutureFlags = {
  removeCardWidth: false,
  removeDefaultMargin: false,
};

export type FutureFlags = typeof defaultFutureFlags;

export const futureFlagsInjectionKey = Symbol("mt-future-flags");

export function provideFutureFlags(flags: FutureFlags | undefined) {
  provide(futureFlagsInjectionKey, flags ?? defaultFutureFlags);
}

export function useFutureFlags(): FutureFlags {
  return inject(futureFlagsInjectionKey, defaultFutureFlags);
}
