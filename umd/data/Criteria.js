var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash/cloneDeep"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDefaultValues = void 0;
    const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
    let defaultPage = 1;
    let defaultLimit = null;
    function setDefaultValues(options) {
        if (options.page) {
            defaultPage = options.page;
        }
        if (options.limit) {
            defaultLimit = options.limit;
        }
    }
    exports.setDefaultValues = setDefaultValues;
    class Criteria {
        constructor(page = defaultPage, limit = defaultLimit) {
            Object.defineProperty(this, "page", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "limit", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "term", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "filters", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "ids", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "queries", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "associations", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "postFilter", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "sortings", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "aggregations", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "grouping", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "fields", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "groupFields", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "totalCountMode", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "includes", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.page = page;
            this.limit = limit;
            this.term = null;
            this.filters = [];
            this.includes = null;
            this.ids = [];
            this.queries = [];
            this.associations = [];
            this.postFilter = [];
            this.sortings = [];
            this.aggregations = [];
            this.grouping = [];
            this.groupFields = [];
            this.fields = [];
            this.totalCountMode = 1 /* TotalCountMode.EXACT_TOTAL_COUNT */;
        }
        static fromCriteria(criteria) {
            return (0, cloneDeep_1.default)(criteria);
        }
        /**
         * Parses the current criteria and generates an object which can be provided to the api
         */
        parse() {
            const params = {};
            if (this.ids.length > 0) {
                params.ids = this.ids.join('|');
            }
            if (this.page !== null) {
                params.page = this.page;
            }
            if (this.limit !== null) {
                params.limit = this.limit;
            }
            if (this.term !== null) {
                params.term = this.term;
            }
            if (this.queries.length > 0) {
                params.query = this.queries;
            }
            if (this.filters.length > 0) {
                params.filter = this.filters;
            }
            if (this.postFilter.length > 0) {
                params['post-filter'] = this.postFilter;
            }
            if (this.sortings.length > 0) {
                params.sort = this.sortings;
            }
            if (this.aggregations.length > 0) {
                params.aggregations = this.aggregations;
            }
            if (this.groupFields.length > 0) {
                params.groupFields = this.groupFields;
            }
            if (this.grouping.length > 0) {
                params.grouping = this.grouping;
            }
            if (this.fields.length > 0) {
                params.fields = this.fields;
            }
            if (this.associations.length > 0) {
                params.associations = {};
                this.associations.forEach((item) => {
                    if (!params.associations) {
                        return;
                    }
                    params.associations[item.association] = item.criteria.parse();
                });
            }
            if (this.includes !== null) {
                params.includes = this.includes;
            }
            if (this.totalCountMode !== null) {
                params['total-count-mode'] = this.totalCountMode;
            }
            return params;
        }
        /**
         * Allows to provide a list of ids which are used as a filter
         */
        setIds(ids) {
            this.ids = ids;
            return this;
        }
        /**
         * Allows to configure the total value of a search result.
         * 0 - no total count will be selected. Should be used if no pagination required (fastest)
         * 1 - exact total count will be selected. Should be used if an exact pagination is required (slow)
         * 2 - fetches limit * 5 + 1. Should be used if pagination can work with "next page exists" (fast)
         */
        setTotalCountMode(mode) {
            if (typeof mode !== 'number') {
                this.totalCountMode = null;
            }
            this.totalCountMode = (mode < 0 || mode > 2) ? null : mode;
            return this;
        }
        setPage(page) {
            this.page = page;
            return this;
        }
        setLimit(limit) {
            this.limit = limit;
            return this;
        }
        setTerm(term) {
            this.term = term;
            return this;
        }
        addFilter(filter) {
            this.filters.push(filter);
            return this;
        }
        addIncludes(include) {
            Object.entries(include).forEach(([entityName, includeValues]) => {
                if (this.includes === null) {
                    this.includes = {};
                }
                if (!this.includes[entityName]) {
                    this.includes[entityName] = [];
                }
                this.includes[entityName].push(...includeValues);
            });
            return this;
        }
        /**
         * Adds the provided filter as post filter.
         * Post filter will be considered for the documents query but not for the aggregations.
         */
        addPostFilter(filter) {
            this.postFilter.push(filter);
            return this;
        }
        /**
         * Allows to add different sortings for the criteria, to sort the entity result.
         */
        addSorting(sorting) {
            this.sortings.push(sorting);
            return this;
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Query\ScoreQuery.
         * These queries are used to search for documents and score them with a ranking
         */
        addQuery(filter, score, scoreField = null) {
            const query = { score: score, query: filter };
            if (scoreField) {
                query[scoreField] = scoreField;
            }
            this.queries.push(query);
            return this;
        }
        /**
         * @param {Object} groupField
         */
        addGroupField(groupField) {
            this.groupFields.push(groupField);
            return this;
        }
        /**
         * Allows grouping the result by a specific field
         */
        addGrouping(field) {
            this.grouping.push(field);
            return this;
        }
        /**
         * Allows loading partial fields for the result.
         */
        addFields(...field) {
            this.fields.push(...field);
            return this;
        }
        /**
         * @param {Object} aggregation
         */
        addAggregation(aggregation) {
            this.aggregations.push(aggregation);
            return this;
        }
        /**
         * Ensures that a criterion is created for each segment of the passed path.
         * Existing Criteria objects are not overwritten.
         * Returns the own instance
         */
        addAssociation(path) {
            const parts = path.split('.');
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let criteria = this;
            parts.forEach((part) => {
                // @ts-expect-error - returns another instance of this
                criteria = criteria.getAssociation(part);
            });
            return this;
        }
        /**
         * Ensures that a criterion is created for each segment of the passed path.
         * Returns the criteria instance of the last path segment
         */
        getAssociation(path) {
            const parts = path.split('.');
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let criteria = this;
            parts.forEach((part) => {
                if (!criteria.hasAssociation(part)) {
                    criteria.associations.push({
                        association: part,
                        criteria: new Criteria(null, null),
                    });
                }
                // @ts-expect-error - returns another instance of this
                criteria = criteria.getAssociationCriteria(part);
            });
            return criteria;
        }
        getAssociationCriteria(part) {
            let criteria = null;
            this.associations.forEach((association) => {
                if (association.association === part) {
                    criteria = association.criteria;
                }
            });
            return criteria;
        }
        getLimit() {
            var _a;
            return (_a = this.limit) !== null && _a !== void 0 ? _a : 0;
        }
        getPage() {
            var _a;
            return (_a = this.page) !== null && _a !== void 0 ? _a : 0;
        }
        getCriteriaData() {
            return {
                page: this.page,
                limit: this.limit,
                term: this.term,
                filters: this.filters,
                ids: this.ids,
                queries: this.queries,
                associations: this.associations,
                postFilter: this.postFilter,
                sortings: this.sortings,
                aggregations: this.aggregations,
                grouping: this.grouping,
                fields: this.fields,
                groupFields: this.groupFields,
                totalCountMode: this.totalCountMode,
                includes: this.includes,
            };
        }
        hasAssociation(property) {
            return this.associations.some((assocation) => {
                return assocation.association === property;
            });
        }
        /**
         * Resets the sorting parameter
         */
        resetSorting() {
            this.sortings = [];
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation
         * Allows to calculate the avg value for the provided field
         */
        static avg(name, field) {
            return { type: 'avg', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\CountAggregation
         * Allows to calculate the count value for the provided field
         */
        static count(name, field) {
            return { type: 'count', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MaxAggregation
         * Allows to calculate the max value for the provided field
         */
        static max(name, field) {
            return { type: 'max', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MinAggregation
         * Allows to calculate the min value for the provided field
         */
        static min(name, field) {
            return { type: 'min', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\StatsAggregation
         * Allows to calculate the sum, max, min, avg, count values for the provided field
         */
        static stats(name, field) {
            return { type: 'stats', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\SumAggregation
         * Allows to calculate the sum value for the provided field
         */
        static sum(name, field) {
            return { type: 'sum', name, field };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\TermsAggregation
         * Allows to fetch term buckets for the provided field
         */
        static terms(name, field, limit = null, sort = null, aggregation = null) {
            return { type: 'terms', name, field, limit, sort, aggregation };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\FilterAggregation
         * Allows to filter an aggregation result
         */
        static filter(name, filter, aggregation) {
            return { type: 'filter', name, filter, aggregation };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\DateHistogramAggregation
         * Allows to fetch date buckets for the provided date interval
         */
        static histogram(name, field, interval, format, aggregation, timeZone) {
            return { type: 'histogram', name, field, interval, format, aggregation, timeZone };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
         * Allows to sort the documents by the provided field
         */
        static sort(field, order = 'ASC', naturalSorting = false) {
            return { field, order, naturalSorting };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
         * Allows to sort the documents by the provided field naturally
         */
        static naturalSorting(field, order = 'ASC') {
            return { field, order, naturalSorting: true };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\CountSorting.
         * Allows to sort the documents by counting associations via the provided field
         *
         * Sql representation: `ORDER BY COUNT({field}) {order}`
         */
        static countSorting(field, order = 'ASC') {
            return { field, order, naturalSorting: false, type: 'count' };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter.
         * This allows to filter documents where the value are contained in the provided field.
         *
         * Sql representation: `{field} LIKE %{value}%`
         */
        static contains(field, value) {
            return { type: 'contains', field, value };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\PrefixFilter.
         * This allows to filter documents where the value marks the beginning of the provided field.
         *
         * Sql representation: `{field} LIKE {value}%`
         */
        static prefix(field, value) {
            return { type: 'prefix', field, value };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\SuffixFilter.
         * This allows to filter documents where the value marks the end of the provided field.
         *
         * Sql representation: `{field} LIKE %{value}`
         */
        static suffix(field, value) {
            return { type: 'suffix', field, value };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter.
         * This allows to filter documents where the field matches one of the provided values
         *
         * Sql representation: `{field} IN ({value}, {value})`
         */
        static equalsAny(field, value) {
            return { type: 'equalsAny', field, value: value.join('|') };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter.
         * This allows to filter documents where the field matches a defined range
         *
         * Sql representation: `{field} >= {value}`, `{field} <= {value}`, ...
         */
        static range(field, range) {
            return { type: 'range', field, parameters: range };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter.
         * This allows to filter documents where the field matches a defined range
         *
         * Sql representation: `{field} = {value}`
         */
        static equals(field, value) {
            return { type: 'equals', field, value };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter.
         * This allows to filter documents which not matches for the provided filters
         * All above listed queries can be provided (equals, equalsAny, range, contains)
         *
         * Sql representation: `NOT({query} {operator} {query} {operator} {query})`
         *
         * @param {string} operator - and/or
         * @param {array} queries
         *
         * @returns {Object}
         */
        static not(operator, queries = []) {
            return { type: 'not', operator: operator, queries: queries };
        }
        /**
         * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter.
         * This allows to filter documents which matches for the provided filters
         * All above listed queries can be provided (equals, equalsAny, range, contains)
         *
         * Sql representation: `({query} {operator} {query} {operator} {query})`
         *
         * @param {string} operator - and/or
         * @param {array} queries
         *
         * @returns {Object}
         */
        static multi(operator, queries = []) {
            return { type: 'multi', operator, queries };
        }
    }
    exports.default = Criteria;
});
//# sourceMappingURL=Criteria.js.map