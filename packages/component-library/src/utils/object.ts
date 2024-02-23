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

export default {
  deepCopyObject,
  hasOwnProperty,
};
