var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "../../data/Criteria"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../utils");
    const Criteria_1 = __importDefault(require("../../data/Criteria"));
    /* eslint-disable */
    const CriteriaSerializer = () => ({
        name: 'criteria',
        serialize: ({ value, customizerMethod, seen, path }) => {
            if (value instanceof Criteria_1.default) {
                return {
                    __type__: '__Criteria__',
                    data: customizerMethod(value.getCriteriaData(), seen, path),
                };
            }
        },
        deserialize: ({ value, customizerMethod }) => {
            // When object is containing a criteria wrapper
            if ((0, utils_1.hasType)('__Criteria__', value) && typeof value['data'] === 'object') {
                // The original values
                const serializedData = value.data;
                // Create new criteria object
                const deserializedCriteria = new Criteria_1.default();
                // Hydrate the criteria with the orignal values
                deserializedCriteria.setPage(serializedData.page);
                deserializedCriteria.setLimit(serializedData.limit);
                deserializedCriteria.setTerm(serializedData.term);
                // @ts-expect-error
                serializedData.filters.forEach((filter) => {
                    deserializedCriteria.addFilter(filter);
                });
                deserializedCriteria.setIds(serializedData.ids);
                // @ts-expect-error
                serializedData.queries.forEach(({ query, score }) => {
                    deserializedCriteria.addQuery(query, score);
                });
                // @ts-expect-error
                serializedData.associations.forEach((association) => {
                    // Associations need also to be deserialized
                    deserializedCriteria.associations.push(customizerMethod(association));
                });
                // @ts-expect-error
                serializedData.postFilter.forEach((filter) => {
                    deserializedCriteria.addPostFilter(filter);
                });
                // @ts-expect-error
                serializedData.sortings.forEach((sorting) => {
                    deserializedCriteria.addSorting(sorting);
                });
                // @ts-expect-error
                serializedData.aggregations.forEach((aggregation) => {
                    deserializedCriteria.addAggregation(aggregation);
                });
                // @ts-expect-error
                serializedData.grouping.forEach((group) => {
                    deserializedCriteria.addGrouping(group);
                });
                // @ts-expect-error
                serializedData.fields.forEach((field) => {
                    deserializedCriteria.addFields(field);
                });
                // @ts-expect-error
                serializedData.groupFields.forEach((groupField) => {
                    deserializedCriteria.addGroupField(groupField);
                });
                if (serializedData.includes) {
                    deserializedCriteria.addIncludes(serializedData.includes);
                }
                deserializedCriteria.setTotalCountMode(serializedData.totalCountMode);
                // Return new Criteria object
                return deserializedCriteria;
            }
        }
    });
    exports.default = CriteriaSerializer;
});
//# sourceMappingURL=criteria-serializer.js.map