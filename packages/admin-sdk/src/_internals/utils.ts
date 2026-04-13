import has from 'lodash-es/has';
import type { extension } from './privileges';

export function generateUniqueId(): string {
  return String(Date.now().toString(36) + Math.random().toString(36).substr(2));
}

/* eslint-disable */
export function isObject(value: unknown): value is any {
  return value !== null && typeof value === 'object';
}

export function getLocationId():string|null {
  const params = new URLSearchParams(window.location.search);

  return params.get('location-id');
}

export function getWindowSrc():string {
    const location = window.location as Location;
    const urlObject = new URL(location.pathname, location.origin);

    return urlObject.toString();
}

export function hasType(type: string, obj: any): boolean {
  return isObject(obj) && obj.__type__ && obj.__type__ === type;
}

export function hasOwnProperty(obj: any, path: string): boolean {
  return has(obj, path);
}


export function traverseObject(this: any, traversableObject: any, processor: (parentEntry: any, key: string, value: any, previousKey: string) => void, previousKey = 'root') {
  for (let index in traversableObject) {
    const currentEntry = traversableObject[index];

    processor.apply(this, [traversableObject, index, currentEntry, previousKey]);

    if (isObject(currentEntry)) {
      let pk = previousKey + '.' + index;
      traverseObject(currentEntry, processor, pk);
    }
  }
}

export function isPrimitive(value: any): boolean {
  return value !== Object(value) || value === null || value === undefined;
}

/**
 * Removes the root prefix from a path
 */
export function removeRoot(path: string | number): string | number {
  if (typeof path !== 'string') {
    return path;
  }

  return path.replace(/^root\./, '');
}

 export function findExtensionByBaseUrl(baseUrl?: string): extension | undefined {
   if (typeof baseUrl !== 'string') {
   return undefined;
   }

   if (baseUrl === '') {
   return undefined;
   }

   const comparedBaseUrl = new URL(baseUrl);

   /*
  * Check if baseUrl is the same as the current window location
  * If so, return the dummy extension with all privileges available
  */
   if (comparedBaseUrl.origin === window.location.origin) {
   return {
     baseUrl: comparedBaseUrl.hostname,
     permissions: {
     additional: ['*'],
     create: ['*'],
     read: ['*'],
     update: ['*'],
     delete: ['*'],
     },
   };
   }

   return Object.values(window._swsdk.adminExtensions)
     .find((ext) => {
     const extensionBaseUrl = new URL(ext.baseUrl);

     return extensionBaseUrl.hostname === comparedBaseUrl.hostname;
     });
 }

/**
 * Returns the technical name (registry key) of the extension matching the given base URL.
 *
 * For cross-origin extensions the lookup uses origin comparison. For same-origin extensions
 * (e.g. plugins served from the same host as the Admin) the origin alone is not enough to
 * distinguish the extension from the Admin itself. Pass the sender `Window` as `sourceWindow`
 * to enable a fallback that matches the window's full href against the known `baseUrl` prefixes.
 *
 * Returns undefined when no matching extension is found or when the origin is the Admin's own
 * origin and no `sourceWindow` is provided.
 */
export function findExtensionNameByBaseUrl(baseUrl?: string, sourceWindow?: Window): string | undefined {
  if (typeof baseUrl !== 'string' || baseUrl === '') {
    return undefined;
  }

  let comparedBaseUrl: URL;
  try {
    comparedBaseUrl = new URL(baseUrl);
  } catch {
    return undefined;
  }

  if (comparedBaseUrl.origin === window.location.origin) {
    // Origin alone cannot resolve same-origin extensions because origin matches
    // the Admin itself. When the sender Window is provided, fall back to href-prefix matching.
    if (sourceWindow) {
      try {
        const href = sourceWindow.location.href;
        const match = Object.entries(window._swsdk.adminExtensions)
          .find(([, ext]) => href.startsWith(ext.baseUrl));
        return match?.[0];
      } catch {
        // Same-origin access should never be denied; ignore defensively.
      }
    }
    return undefined;
  }

  return Object.entries(window._swsdk.adminExtensions).find(([, ext]) => {
    try {
      return new URL(ext.baseUrl).origin === comparedBaseUrl.origin;
    } catch {
      return false;
    }
  })?.[0];
}