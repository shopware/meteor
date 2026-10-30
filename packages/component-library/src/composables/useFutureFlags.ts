import { inject, provide, reactive, toValue, watch, type MaybeRefOrGetter } from "vue";

const defaultFutureFlags = {
  removeCardWidth: false,
  removeDefaultMargin: false,
  removeSwitchMinHeight: false,
  bannerFullWidth: false,
  consistentLabelLineHeight: false,
};

export type FutureFlags = typeof defaultFutureFlags;

/**
 * What an application may pass to opt into future behavior:
 * - a subset of flags, e.g. `{ removeCardWidth: true }`
 * - `{ all: true }` to enable every current and upcoming flag at once
 * - `{ all: true }` with overrides, e.g. `{ all: true, removeCardWidth: false }` to enable all but one
 */
export type FutureFlagsInput = Partial<FutureFlags> & { all?: boolean };

export const futureFlagsInjectionKey = Symbol("mt-future-flags");

function allEnabled(): FutureFlags {
  return Object.fromEntries(
    Object.keys(defaultFutureFlags).map((key) => [key, true]),
  ) as FutureFlags;
}

export function resolveFutureFlags(input: FutureFlagsInput | undefined): FutureFlags {
  if (input == null) {
    return { ...defaultFutureFlags };
  }

  // `all: true` turns everything on first, remaining keys override.
  const { all, ...overrides } = input;
  const base = all ? allEnabled() : defaultFutureFlags;

  return { ...base, ...overrides };
}

/** Provides the resolved flags to all descendants. With a ref or getter, they stay in sync with it. */
export function provideFutureFlags(input: MaybeRefOrGetter<FutureFlagsInput | undefined>) {
  const flags = reactive(resolveFutureFlags(toValue(input)));

  watch(
    () => resolveFutureFlags(toValue(input)),
    (next) => Object.assign(flags, next),
  );

  provide(futureFlagsInjectionKey, flags);
}

export function useFutureFlags(): FutureFlags {
  return inject(futureFlagsInjectionKey, defaultFutureFlags);
}
