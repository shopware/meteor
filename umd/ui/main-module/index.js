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
    exports.addSmartBarButton = exports.addMainModule = void 0;
    const channel_1 = require("../../channel");
    exports.addMainModule = (0, channel_1.createSender)('mainModuleAdd');
    exports.addSmartBarButton = (0, channel_1.createSender)('smartBarButtonAdd');
});
//# sourceMappingURL=index.js.map