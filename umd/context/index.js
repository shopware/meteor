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
    exports.getModuleInformation = exports.getAppInformation = exports.getUserTimezone = exports.getUserInformation = exports.getShopwareVersion = exports.getCurrency = exports.subscribeLocale = exports.getLocale = exports.getEnvironment = exports.subscribeLanguage = exports.getLanguage = void 0;
    const channel_1 = require("../channel");
    exports.getLanguage = (0, channel_1.createSender)('contextLanguage', {});
    exports.subscribeLanguage = (0, channel_1.createSubscriber)('contextLanguage');
    exports.getEnvironment = (0, channel_1.createSender)('contextEnvironment', {});
    exports.getLocale = (0, channel_1.createSender)('contextLocale', {});
    exports.subscribeLocale = (0, channel_1.createSubscriber)('contextLocale');
    exports.getCurrency = (0, channel_1.createSender)('contextCurrency', {});
    exports.getShopwareVersion = (0, channel_1.createSender)('contextShopwareVersion', {});
    exports.getUserInformation = (0, channel_1.createSender)('contextUserInformation', {});
    exports.getUserTimezone = (0, channel_1.createSender)('contextUserTimezone', {});
    exports.getAppInformation = (0, channel_1.createSender)('contextAppInformation', {});
    exports.getModuleInformation = (0, channel_1.createSender)('contextModuleInformation', {});
});
//# sourceMappingURL=index.js.map