var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "../privileges/missing-privileges-error"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.selectData = void 0;
    const utils_1 = require("../utils");
    const missing_privileges_error_1 = __importDefault(require("../privileges/missing-privileges-error"));
    /**
     * Selects data from a source object using a list of selectors.
     */
    function selectData(sourceData, selectors, messageType = 'datasetSubscribe', origin = '') {
        if (!selectors) {
            return sourceData;
        }
        const result = {};
        const extension = (0, utils_1.findExtensionByBaseUrl)(origin !== null && origin !== void 0 ? origin : '');
        const permissionErrors = [];
        // Iterate through all selectors, e.g. ['a.b.c', 'd.e.f']
        selectors.forEach((selector) => {
            selectValue(sourceData, selector, extension, permissionErrors, origin, messageType, result);
        });
        if (!extension) {
            console.warn(`No extension found for origin "${origin}"`);
            return result;
        }
        if (permissionErrors.length) {
            return new missing_privileges_error_1.default(messageType, permissionErrors);
        }
        return result;
    }
    exports.selectData = selectData;
    /**
     * Adds the structure and value of the selector to the result object.
     * Also checks if the extension has the required permissions for the given data.
     */
    function selectValue(data, selector, extension, permissionErrors, origin, messageType, result = {}) {
        var _a, _b, _c;
        const parts = selector.split('.');
        let tmpResult = result;
        let tmpData = data;
        // Iterate through all parts of the selector, e.g. ['products', '*', 'name']
        for (let i = 0; i < parts.length; i++) {
            const specificArrayMatcher = /\[\d*\]/;
            const currentPart = parts[i];
            const nextPart = parts[i + 1];
            // Next part is wildcard or specific array selector
            if (nextPart && (nextPart === '*' || nextPart.match(specificArrayMatcher))) {
                // No part after the wildcard? Add the whole array to the result
                if (!parts[i + 2]) {
                    // Check parent object permissions
                    checkPermission(tmpData, extension, permissionErrors);
                    // Check requested value permissions
                    checkPermission(tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart], extension, permissionErrors);
                    tmpResult[currentPart] = tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart];
                    break;
                }
                // Set next value as existing array or create a new one
                tmpResult[currentPart] = (_a = tmpResult[currentPart]) !== null && _a !== void 0 ? _a : [];
                tmpData = tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart];
                tmpResult = tmpResult[currentPart];
                continue;
            }
            // Setting data into an array with a following selector
            if (Array.isArray(tmpData) && nextPart) {
                const selectorAfterCurrent = parts.slice(i + 1).join('.');
                // Current part was a wildcard? Add the value for all array entries
                if (currentPart === '*') {
                    for (let j = 0; j < tmpData.length; j++) {
                        selectValue(tmpData[j], selectorAfterCurrent, extension, permissionErrors, origin, messageType, 
                        // Result is either the root array or the existing array entry
                        ((_b = tmpResult[j]) !== null && _b !== void 0 ? _b : tmpResult));
                    }
                    break;
                }
                // Current part was a specific array index? Add the value for the specific array entry
                if (currentPart.match(specificArrayMatcher)) {
                    const index = parseArrayIndex(currentPart);
                    selectValue(tmpData[index], selectorAfterCurrent, extension, permissionErrors, origin, messageType, 
                    // Result is either the root array or the existing array entry
                    ((_c = tmpResult[index]) !== null && _c !== void 0 ? _c : tmpResult));
                    break;
                }
            }
            // Is the current part the last of the selector?
            if (i === parts.length - 1) {
                // Check parent object permissions
                checkPermission(tmpData, extension, permissionErrors);
                // Check requested value permissions
                checkPermission(tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart], extension, permissionErrors);
                // Add value to array
                if (Array.isArray(tmpResult)) {
                    tmpResult.push({ [currentPart]: tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart] });
                    break;
                }
                // Adds the value to object structures
                tmpResult[currentPart] = tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart];
                break;
            }
            // Move to next level
            tmpResult[currentPart] = {};
            tmpData = tmpData === null || tmpData === void 0 ? void 0 : tmpData[currentPart];
            tmpResult = tmpResult[currentPart];
        }
        return result;
    }
    /**
     * Checks if the extension has the required permissions for the given data.
     */
    function checkPermission(data, extension, permissionErrors) {
        if (!data) {
            return;
        }
        const permissionsToCheck = ['read'];
        let entityName = '';
        // @ts-expect-error - we just check if the value is an entity
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (data.__identifier__ && data.__identifier__() === 'Entity') {
            // @ts-expect-error - we know that the value is an entity
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            entityName = data.getEntityName();
        }
        // @ts-expect-error - we just check if the value is an entityCollection
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (data.__identifier__ && data.__identifier__() === 'EntityCollection') {
            // @ts-expect-error - we know that the value is an entityCollection
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            entityName = data.entity;
        }
        if (!entityName) {
            return;
        }
        permissionsToCheck.forEach((privilege) => {
            var _a;
            const permissionsForPrivilege = (_a = extension === null || extension === void 0 ? void 0 : extension.permissions) === null || _a === void 0 ? void 0 : _a[privilege];
            if ((!permissionsForPrivilege ||
                !permissionsForPrivilege.includes(entityName))
                &&
                    !permissionErrors.includes(`${privilege}:${entityName}`)
                &&
                    !(permissionsForPrivilege === null || permissionsForPrivilege === void 0 ? void 0 : permissionsForPrivilege.includes('*'))) {
                permissionErrors.push(`${privilege}:${entityName}`);
            }
        });
    }
    /**
     * Parses the array index from a string.
     */
    function parseArrayIndex(index) {
        return Number.parseInt(index.replace('[', '').replace(']', ''));
    }
});
//# sourceMappingURL=selectData.js.map