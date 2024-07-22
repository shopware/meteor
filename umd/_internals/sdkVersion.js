var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../package.json"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * JS file is needed because TypeScript can't use JSON imports
     * for UMD builds.
     */
    const package_json_1 = __importDefault(require("../../package.json"));
    exports.default = package_json_1.default.version;
});
//# sourceMappingURL=sdkVersion.js.map