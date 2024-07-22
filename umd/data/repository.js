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
    const channel_1 = require("../channel");
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    exports.default = (entityName) => ({
        search: (criteria, context) => {
            return (0, channel_1.send)('repositorySearch', { entityName, context, criteria });
        },
        get: (id, context, criteria) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (0, channel_1.send)('repositoryGet', { entityName, id, context, criteria });
        },
        save: (entity, context) => {
            return (0, channel_1.send)('repositorySave', { entityName, entity, context });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clone: (entityId, context, behavior) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            return (0, channel_1.send)('repositoryClone', { entityName, entityId, context, behavior });
        },
        hasChanges: (entity) => {
            return (0, channel_1.send)('repositoryHasChanges', { entityName, entity });
        },
        saveAll: (entities, context) => {
            return (0, channel_1.send)('repositorySaveAll', { entityName, entities, context });
        },
        delete: (entityId, context) => {
            return (0, channel_1.send)('repositoryDelete', { entityName, entityId, context });
        },
        create: (context, entityId) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (0, channel_1.send)('repositoryCreate', { entityName, entityId, context });
        },
    });
});
//# sourceMappingURL=repository.js.map