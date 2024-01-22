export function set(target: Record<string, any>, path: string, value: any) {
  const keys = path.split(".");
  let currentObj = target;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!currentObj.hasOwnProperty(key)) {
      currentObj[key] = {};
    } else if (typeof currentObj[key] !== "object") {
      throw new Error(`Invalid path: "${key}" is not an object`);
    }

    currentObj = currentObj[key];
  }

  const lastKey = keys[keys.length - 1];
  currentObj[lastKey] = value;

  return target;
}
