/**
 * Checks if a value is a Promise.
 * @param value - The value to check.
 * @return True if the value is a Promise, false otherwise.
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    'then' in value &&
    typeof value.then === 'function' &&
    'catch' in value &&
    typeof value.catch === 'function'
  );
}
