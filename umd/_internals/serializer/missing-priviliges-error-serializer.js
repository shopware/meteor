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
    /* eslint-disable */
    const MissingPrivilegesErrorSerializer = () => ({
        name: 'handle-error',
        // serialize is empty because the error contains a toJSON function
        serialize: () => { },
        deserialize: ({ value }) => {
            if ((0, utils_1.hasType)('__MissingPrivilegesError__', value)) {
                return new missing_privileges_error_1.default(value.__messageType__, value.__data__);
            }
        },
    });
    exports.default = MissingPrivilegesErrorSerializer;
});
//# sourceMappingURL=missing-priviliges-error-serializer.js.map