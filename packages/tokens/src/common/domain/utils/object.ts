export function set(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
) {
  const keys = path.split('.');
  let currentObj = target;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!key)
      throw new Error('Failed to set property on object: Key does not exist.');

    if (!(key in currentObj)) {
      currentObj[key] = {};
    } else if (typeof currentObj[key] !== 'object') {
      throw new Error(`Invalid path: "${key}" is not an object`);
    }

    currentObj = currentObj[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  if (!lastKey)
    throw new Error(
      'Failed to set property on object: Last key does not exist.',
    );

  currentObj[lastKey] = value;

  return target;
}

export function get(target: Record<string, unknown>, path: string) {
  const keys = path.split('.');
  let currentObj = target;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key)
      throw new Error(
        'Failed to access property of object: Key does not exist.',
      );

    if (!(key in currentObj)) {
      return undefined;
    }

    currentObj = currentObj[key] as Record<string, unknown>;
  }

  return currentObj;
}

export function isObject(value: unknown): value is object {
  return !!(value && typeof value === 'object' && !Array.isArray(value));
}
