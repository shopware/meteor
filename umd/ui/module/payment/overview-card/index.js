(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../../channel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add = void 0;
    const channel_1 = require("../../../../channel");
    exports.add = (0, channel_1.createSender)('uiModulePaymentOverviewCard');
});
//# sourceMappingURL=index.js.map