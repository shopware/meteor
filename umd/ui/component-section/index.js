(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../channel", "../../_internals/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add = void 0;
    const channel_1 = require("../../channel");
    const utils_1 = require("../../_internals/utils");
    exports.add = (0, channel_1.createSender)('uiComponentSectionRenderer', {
        src: (_a = (0, utils_1.getWindowSrc)()) !== null && _a !== void 0 ? _a : undefined,
    });
});
//# sourceMappingURL=index.js.map