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
    const utils_1 = require("../utils");
    const missing_privileges_error_1 = __importDefault(require("../privileges/missing-privileges-error"));
    function validate({ serializedData, origin, type, privilegesToCheck = [], }) {
        if (origin === undefined) {
            return null;
        }
        const extension = (0, utils_1.findExtensionByBaseUrl)(origin);
        if (!extension) {
            console.warn(`No extension found for origin "${origin}"`);
            return null;
        }
        // Check privileges for entity
        const privilegeErrors = [];
        (0, utils_1.traverseObject)(serializedData, (parentEntry, key, value) => {
            if (key === '__type__' && ['__EntityCollection__', '__Entity__'].includes(value)) {
                const entityName = parentEntry.__entityName__;
                if (!entityName) {
                    return;
                }
                [...privilegesToCheck].sort().forEach(privilege => {
                    const permissionsForPrivilege = extension.permissions[privilege];
                    if ((!permissionsForPrivilege ||
                        !permissionsForPrivilege.includes(entityName))
                        &&
                            !privilegeErrors.includes(`${privilege}:${entityName}`)
                        &&
                            !(permissionsForPrivilege === null || permissionsForPrivilege === void 0 ? void 0 : permissionsForPrivilege.includes('*'))) {
                        privilegeErrors.push(`${privilege}:${entityName}`);
                    }
                });
            }
        });
        if (privilegeErrors.length > 0) {
            return new missing_privileges_error_1.default(type, privilegeErrors);
        }
        return null;
    }
    exports.default = validate;
});
//# sourceMappingURL=index.js.map