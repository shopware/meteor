(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../channel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.actionExecute = void 0;
    const channel_1 = require("../../channel");
    exports.actionExecute = (0, channel_1.createSender)('actionExecute');
});
//# sourceMappingURL=index.js.map