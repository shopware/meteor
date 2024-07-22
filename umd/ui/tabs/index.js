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
    const channel_1 = require("../../channel");
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    exports.default = (tabPositionId) => ({
        addTabItem: (0, channel_1.createSender)('uiTabsAddTabItem', { positionId: tabPositionId }),
    });
});
//# sourceMappingURL=index.js.map