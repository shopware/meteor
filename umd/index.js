var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./window", "./notification", "./toast", "./context", "./ui/component-section", "./ui/tabs", "./ui/cms", "./location", "./ui/menu", "./ui/settings", "./ui/main-module", "./ui/module", "./ui/modal", "./ui/action-button", "./app/action", "./data", "./iap", "./data/composables"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iap = exports.composables = exports.data = exports.app = exports.location = exports.cms = exports.ui = exports.context = exports.toast = exports.notification = exports.window = void 0;
    const window = __importStar(require("./window"));
    exports.window = window;
    const notification = __importStar(require("./notification"));
    exports.notification = notification;
    const toast = __importStar(require("./toast"));
    exports.toast = toast;
    const context = __importStar(require("./context"));
    exports.context = context;
    const componentSection = __importStar(require("./ui/component-section"));
    const tabs_1 = __importDefault(require("./ui/tabs"));
    const cms = __importStar(require("./ui/cms"));
    exports.cms = cms;
    const location = __importStar(require("./location"));
    exports.location = location;
    const menu = __importStar(require("./ui/menu"));
    const settings = __importStar(require("./ui/settings"));
    const mainModule = __importStar(require("./ui/main-module"));
    const module = __importStar(require("./ui/module"));
    const modal = __importStar(require("./ui/modal"));
    const actionButton = __importStar(require("./ui/action-button"));
    const webhook = __importStar(require("./app/action"));
    const data = __importStar(require("./data"));
    exports.data = data;
    const iap = __importStar(require("./iap"));
    exports.iap = iap;
    const composables_1 = __importDefault(require("./data/composables"));
    exports.composables = composables_1.default;
    const app = {
        webhook,
    };
    exports.app = app;
    const ui = {
        componentSection,
        tabs: tabs_1.default,
        menu,
        settings,
        mainModule,
        module,
        modal,
        actionButton,
    };
    exports.ui = ui;
});
//# sourceMappingURL=index.js.map