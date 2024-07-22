var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findExtensionByBaseUrl = exports.removeRoot = exports.isPrimitive = exports.traverseObject = exports.hasOwnProperty = exports.hasType = exports.getWindowSrc = exports.getLocationId = exports.isObject = exports.generateUniqueId = void 0;
    const has_1 = __importDefault(require("lodash/has"));
    function generateUniqueId() {
        return String(Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    exports.generateUniqueId = generateUniqueId;
    /* eslint-disable */
    function isObject(value) {
        return value !== null && typeof value === 'object';
    }
    exports.isObject = isObject;
    function getLocationId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('location-id');
    }
    exports.getLocationId = getLocationId;
    function getWindowSrc() {
        const location = window.location;
        const urlObject = new URL(location.pathname, location.origin);
        return urlObject.toString();
    }
    exports.getWindowSrc = getWindowSrc;
    function hasType(type, obj) {
        return isObject(obj) && obj.__type__ && obj.__type__ === type;
    }
    exports.hasType = hasType;
    function hasOwnProperty(obj, path) {
        return (0, has_1.default)(obj, path);
    }
    exports.hasOwnProperty = hasOwnProperty;
    function traverseObject(traversableObject, processor, previousKey = 'root') {
        for (let index in traversableObject) {
            const currentEntry = traversableObject[index];
            processor.apply(this, [traversableObject, index, currentEntry, previousKey]);
            if (isObject(currentEntry)) {
                let pk = previousKey + '.' + index;
                traverseObject(currentEntry, processor, pk);
            }
        }
    }
    exports.traverseObject = traverseObject;
    function isPrimitive(value) {
        return value !== Object(value) || value === null || value === undefined;
    }
    exports.isPrimitive = isPrimitive;
    /**
     * Removes the root prefix from a path
     */
    function removeRoot(path) {
        if (typeof path !== 'string') {
            return path;
        }
        return path.replace(/^root\./, '');
    }
    exports.removeRoot = removeRoot;
    function findExtensionByBaseUrl(baseUrl) {
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
    exports.findExtensionByBaseUrl = findExtensionByBaseUrl;
});
//# sourceMappingURL=utils.js.map