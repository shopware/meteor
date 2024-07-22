var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../channel", "../_internals/privileges/missing-privileges-error", "./Criteria", "../_internals/data/Entity", "../_internals/data/EntityCollection", "./repository"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Classes = exports.repository = exports.handleGet = exports.updateSubscriber = exports.register = exports.update = exports.get = exports.subscribe = void 0;
    const channel_1 = require("../channel");
    const missing_privileges_error_1 = __importDefault(require("../_internals/privileges/missing-privileges-error"));
    const Criteria_1 = __importDefault(require("./Criteria"));
    const Entity_1 = __importDefault(require("../_internals/data/Entity"));
    const EntityCollection_1 = __importDefault(require("../_internals/data/EntityCollection"));
    const repository_1 = __importDefault(require("./repository"));
    exports.repository = repository_1.default;
    // Internal function to create a filterable subscriber
    function createFilteredSubscriber(type) {
        return (id, callback, options) => {
            if (type === 'datasetSubscribe') {
                // Send message to admin that this window wants to subscribe to a dataset
                void (0, channel_1.send)('datasetSubscribeRegistration', {
                    id,
                    selectors: options === null || options === void 0 ? void 0 : options.selectors,
                });
            }
            const wrapper = (data) => {
                var _a;
                if ((data === null || data === void 0 ? void 0 : data.id) !== id) {
                    return;
                }
                if (data.selectors && data.selectors.length > 0) {
                    // Compare if the selectors match independent of the order
                    if (((_a = options === null || options === void 0 ? void 0 : options.selectors) === null || _a === void 0 ? void 0 : _a.sort().join(',')) !== data.selectors.sort().join(',')) {
                        return;
                    }
                }
                // Check if data.data is an error and log it
                if ((data === null || data === void 0 ? void 0 : data.data) instanceof missing_privileges_error_1.default) {
                    console.error(data.data);
                }
                const returnValue = callback(data);
                if (returnValue) {
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    returnValue.catch(() => { });
                }
            };
            return (0, channel_1.subscribe)(type, wrapper);
        };
    }
    /**
     * Methods used by extension developers to get and update data
     */
    exports.subscribe = createFilteredSubscriber('datasetSubscribe');
    exports.get = (0, channel_1.createSender)('datasetGet');
    exports.update = (0, channel_1.createSender)('datasetUpdate');
    /**
     * Internal methods used by the administration
     */
    exports.register = channel_1.processDataRegistration;
    exports.updateSubscriber = createFilteredSubscriber('datasetUpdate');
    exports.handleGet = (0, channel_1.createHandler)('datasetGet');
    const Classes = {
        Criteria: Criteria_1.default,
        Entity: Entity_1.default,
        EntityCollection: EntityCollection_1.default,
    };
    exports.Classes = Classes;
});
//# sourceMappingURL=index.js.map