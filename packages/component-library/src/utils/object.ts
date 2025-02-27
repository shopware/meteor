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

export default {
  deepCopyObject,
  hasOwnProperty,
  get,
};
