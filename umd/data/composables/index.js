(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./useSharedState"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const useSharedState_1 = require("./useSharedState");
    exports.default = {
        useSharedState: useSharedState_1.useSharedState,
    };
});
//# sourceMappingURL=index.js.map