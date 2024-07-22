import has from 'lodash/has';
export function generateUniqueId() {
    return String(Date.now().toString(36) + Math.random().toString(36).substr(2));
}
/* eslint-disable */
export function isObject(value) {
    return value !== null && typeof value === 'object';
}
export function getLocationId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('location-id');
}
export function getWindowSrc() {
    const location = window.location;
    const urlObject = new URL(location.pathname, location.origin);
    return urlObject.toString();
}
export function hasType(type, obj) {
    return isObject(obj) && obj.__type__ && obj.__type__ === type;
}
export function hasOwnProperty(obj, path) {
    return has(obj, path);
}
export function traverseObject(traversableObject, processor, previousKey = 'root') {
    for (let index in traversableObject) {
        const currentEntry = traversableObject[index];
        processor.apply(this, [traversableObject, index, currentEntry, previousKey]);
        if (isObject(currentEntry)) {
            let pk = previousKey + '.' + index;
            traverseObject(currentEntry, processor, pk);
        }
    }
}
export function isPrimitive(value) {
    return value !== Object(value) || value === null || value === undefined;
}
/**
 * Removes the root prefix from a path
 */
export function removeRoot(path) {
    if (typeof path !== 'string') {
        return path;
    }
    return path.replace(/^root\./, '');
}
export function findExtensionByBaseUrl(baseUrl) {
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
//# sourceMappingURL=utils.js.map