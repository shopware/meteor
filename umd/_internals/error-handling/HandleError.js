(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HandleError extends Error {
        constructor(msg, code) {
            super(msg);
            Object.defineProperty(this, "code", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 500
            });
            if (!code) {
                return;
            }
            this.code = code;
        }
        toJSON() {
            return {
                __type__: '__HandleError__',
                __code__: this.code,
                __message__: this.message,
            };
        }
    }
    exports.default = HandleError;
});
//# sourceMappingURL=HandleError.js.map