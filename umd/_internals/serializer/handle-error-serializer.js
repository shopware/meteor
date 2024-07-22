var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "../error-handling/HandleError"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../utils");
    const HandleError_1 = __importDefault(require("../error-handling/HandleError"));
    /* eslint-disable */
    const HandleErrorSerializerFactory = () => ({
        name: 'handle-error',
        // serialize is empty because the error contains a toJSON function
        serialize: () => { },
        deserialize: ({ value }) => {
            if ((0, utils_1.hasType)('__HandleError__', value)) {
                return new HandleError_1.default(value.__message__, value.__code__);
            }
        },
    });
    exports.default = HandleErrorSerializerFactory;
});
//# sourceMappingURL=handle-error-serializer.js.map