/**
 * Deep copy an object
 */
export function deepCopyObject<O extends object>(copyObject: O): O {
  return JSON.parse(JSON.stringify(copyObject)) as O;
}

export function hasOwnProperty(scope: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(scope, prop);
}

type GetPath = string | number | (string | number)[];

/**
 * Safely retrieves a value from a nested object using a path.
 */
export const get = <T extends object, D = undefined>(
  obj: T | null | undefined,
  path: GetPath,
  defValue?: D,
): D | undefined | any => {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : String(path).match(/([^[.\]])+/g);

  if (!pathArray) return undefined;

  // Find value
  const result = pathArray.reduce<any>((prevObj, key) => prevObj && prevObj[key], obj);
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defValue : result;
};

/**
 * Retrieves a value from an object using a property path, with support for fallback paths.
 * When given an array of paths, returns the first non-empty value found.
 *
 * @param object - The source object to extract the value from
 * @param propertyPath - Either a single string path or an array of string paths to try in order
 * @param defaultValue - Value to return if no non-empty value is found
 * @returns The first non-empty value found, or the default value if none found
 */
export function getPropertyValue(object: any, propertyPath: string | string[], defaultValue?: any) {
  if (!propertyPath) {
    return object;
  }

  if (Array.isArray(propertyPath)) {
    for (const path of propertyPath) {
      const value = get(object, path, "");
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return defaultValue;
  }

  return get(object, propertyPath, defaultValue);
}

/**
 * Takes two objects and merges them deeply.
 * If a property exists in both objects and is an object itself, it will merge them recursively.
 * If a property exists in the source object but not in the target, it will be added to the target.
 * If a property exists in the target but not in the source, it will remain unchanged.
 * If a property exists in both objects but is not an object, the source value will overwrite the target value.
 *
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @return The merged object
 */
export function deepMergeObjects<T extends object>(target: T, source: Partial<T>): T {
  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (
      sourceValue instanceof Object &&
      !Array.isArray(sourceValue) &&
      targetValue instanceof Object &&
      !Array.isArray(targetValue)
    ) {
      target[key] = deepMergeObjects(targetValue as any, sourceValue as any);
    } else {
      target[key] = sourceValue as any;
    }
  }
  return target;
}

export default {
  deepCopyObject,
  hasOwnProperty,
  get,
  getPropertyValue,
};
