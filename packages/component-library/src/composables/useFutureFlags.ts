import { inject, provide } from "vue";

export type FutureFlags = {};

const defaultFutureFlags: FutureFlags = {};

export const futureFlagsInjectionKey = Symbol("mt-future-flags");

export function provideFutureFlags(flags: FutureFlags | undefined) {
  provide(futureFlagsInjectionKey, flags ?? defaultFutureFlags);
}

export function useFutureFlags(): FutureFlags {
  return inject(futureFlagsInjectionKey, defaultFutureFlags);
}
