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
    exports.reload = exports.routerPush = exports.redirect = void 0;
    const channel_1 = require("../channel");
    exports.redirect = (0, channel_1.createSender)('windowRedirect');
    exports.routerPush = (0, channel_1.createSender)('windowRouterPush');
    exports.reload = (0, channel_1.createSender)('windowReload', {});
});
//# sourceMappingURL=index.js.map