var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Criteria"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addDataTableFilters = void 0;
    const Criteria_1 = __importDefault(require("./Criteria"));
    function addDataTableFilters(criteria, filters) {
        filters.forEach((filter) => {
            filter.type.options.forEach((option) => {
                criteria.addFilter(Criteria_1.default.equals(filter.id, option.id));
            });
        });
        return criteria;
    }
    exports.addDataTableFilters = addDataTableFilters;
});
//# sourceMappingURL=data-table-filter.helper.js.map