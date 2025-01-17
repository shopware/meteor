/**
 * Deep copy an object
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepCopyObject<O extends object>(copyObject: O): O {
  return JSON.parse(JSON.stringify(copyObject)) as O;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasOwnProperty(scope: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(scope, prop);
}

type GetPath = string | (string | number)[];

/**
 * Safely retrieves a value from a nested object using a path.
 * @template T - The type of the source object
 * @template D - The type of the default value
 * @param obj - The source object to retrieve the value from
 * @param path - The path to the value as a dot notation string or array of keys
 * @param defValue - The default value to return if the path doesn't exist
 * @returns The value at the specified path or the default value
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
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

  if (!pathArray) return undefined;

  // Find value
  const result = pathArray.reduce<any>((prevObj, key) => prevObj && prevObj[key], obj);
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defValue : result;
};

export default {
  deepCopyObject,
  hasOwnProperty,
  get,
};
