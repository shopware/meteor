var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./HandleError", "../utils", "../privileges/missing-privileges-error"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const HandleError_1 = __importDefault(require("./HandleError"));
    const utils_1 = require("../utils");
    const missing_privileges_error_1 = __importDefault(require("../privileges/missing-privileges-error"));
    function createError(type, e) {
        if (typeof e === 'string') {
            return new HandleError_1.default(e);
        }
        if (!(e instanceof Error)) {
            return new HandleError_1.default('An unknown error occurred.');
        }
        /* eslint-disable */
        if ((0, utils_1.hasOwnProperty)(e, 'response.data.errors.0.code') && e.response.data.errors.length) {
            const missingPrivilegeErrors = e.response.data.errors
                .filter((error) => error.code === 'FRAMEWORK__MISSING_PRIVILEGE_ERROR');
            const missingPrivileges = [];
            missingPrivilegeErrors.forEach((mpe) => {
                const data = JSON.parse(mpe.detail);
                missingPrivileges.push(...data.missingPrivileges);
            });
            if (missingPrivileges.length) {
                return new missing_privileges_error_1.default(type, missingPrivileges);
            }
            return new HandleError_1.default(e.response.data.errors[0].code, e.response.data.errors[0].status);
        }
        return new HandleError_1.default(e.message);
    }
    exports.default = createError;
});
//# sourceMappingURL=error-factory.js.map