(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../channel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.purchase = void 0;
    const channel_1 = require("../channel");
    /**
     * Trigger the in-app purchase.
     */
    exports.purchase = (0, channel_1.createSender)('inAppPurchase');
});
//# sourceMappingURL=index.js.map