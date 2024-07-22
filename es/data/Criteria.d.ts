export declare const enum TotalCountMode {
    'NO_TOTAL_COUNT' = 0,
    'EXACT_TOTAL_COUNT' = 1,
    'PAGINATION_TOTAL_COUNT' = 2
}
interface Filters {
    contains: {
        type: 'contains';
        field: string;
        value: string;
    };
    prefix: {
        type: 'prefix';
        field: string;
        value: string;
    };
    suffix: {
        type: 'suffix';
        field: string;
        value: string;
    };
    equalsAny: {
        type: 'equalsAny';
        field: string;
        value: string;
    };
    equals: {
        type: 'equals';
        field: string;
        value: string | number | boolean | null;
    };
    range: {
        type: 'range';
        field: string;
        parameters: {
            lte?: string;
            lt?: string;
            gte?: string;
            gt?: string;
        };
    };
    not: {
        type: 'not';
        operator: 'and' | 'AND' | 'or' | 'OR';
        queries: SingleFilter[];
    };
    multi: {
        type: 'multi';
        operator: 'and' | 'AND' | 'or' | 'OR';
        queries: SingleFilter[];
    };
}
interface Aggregations {
    histogram: {
        type: 'histogram';
        name: string;
        field: string;
        interval: string | null;
        format: string | null;
        aggregation: Aggregation | null;
        timeZone: string | null;
    };
    terms: {
        type: 'terms';
        name: string;
        field: string;
        limit: number | null;
        sort: Sorting | null;
        aggregation: Aggregation | null;
    };
    sum: {
        type: 'sum';
        name: string;
        field: string;
    };
    stats: {
        type: 'stats';
        name: string;
        field: string;
    };
    min: {
        type: 'min';
        name: string;
        field: string;
    };
    max: {
        type: 'max';
        name: string;
        field: string;
    };
    count: {
        type: 'count';
        name: string;
        field: string;
    };
    avg: {
        type: 'avg';
        name: string;
        field: string;
    };
}
type ValueOf<T> = T[keyof T];
type SingleFilter = ValueOf<Filters>;
type Aggregation = ValueOf<Aggregations>;
interface Filter {
    type: 'filter';
    name: string;
    filter: SingleFilter[];
    aggregation: Aggregation[];
}
interface Include {
    [entityName: string]: string[];
}
interface Association {
    association: string;
    criteria: Criteria;
}
interface Query {
    score: number;
    query: SingleFilter;
    [scoreField: string]: unknown;
}
interface Sorting {
    field: string;
    order: 'ASC' | 'DESC';
    naturalSorting: boolean;
    type?: string;
}
type GroupField = string;
interface RequestParams {
    ids?: string;
    page?: number;
    limit?: number;
    term?: string;
    query?: Query[];
    filter?: SingleFilter[];
    'post-filter'?: SingleFilter[];
    sort?: Sorting[];
    aggregations?: Aggregation[];
    groupFields?: GroupField[];
    grouping?: string[];
    fields?: string[];
    associations?: {
        [association: string]: RequestParams;
    };
    includes?: Include;
    'total-count-mode'?: TotalCountMode;
}
export declare function setDefaultValues(options: {
    page?: number | null;
    limit?: number | null;
}): void;
export default class Criteria {
    page: number | null;
    limit: number | null;
    term: string | null;
    filters: SingleFilter[];
    ids: string[];
    queries: Query[];
    associations: Association[];
    postFilter: SingleFilter[];
    sortings: Sorting[];
    aggregations: Aggregation[];
    grouping: string[];
    fields: string[];
    groupFields: GroupField[];
    totalCountMode: TotalCountMode | null;
    includes: Include | null;
    constructor(page?: number | null, limit?: number | null);
    static fromCriteria(criteria: Criteria): Criteria;
    /**
     * Parses the current criteria and generates an object which can be provided to the api
     */
    parse(): RequestParams;
    /**
     * Allows to provide a list of ids which are used as a filter
     */
    setIds(ids: string[]): this;
    /**
     * Allows to configure the total value of a search result.
     * 0 - no total count will be selected. Should be used if no pagination required (fastest)
     * 1 - exact total count will be selected. Should be used if an exact pagination is required (slow)
     * 2 - fetches limit * 5 + 1. Should be used if pagination can work with "next page exists" (fast)
     */
    setTotalCountMode(mode: TotalCountMode): this;
    setPage(page: number): this;
    setLimit(limit: number): this;
    setTerm(term: string): this;
    addFilter(filter: SingleFilter): this;
    addIncludes(include: Include): this;
    /**
     * Adds the provided filter as post filter.
     * Post filter will be considered for the documents query but not for the aggregations.
     */
    addPostFilter(filter: SingleFilter): this;
    /**
     * Allows to add different sortings for the criteria, to sort the entity result.
     */
    addSorting(sorting: Sorting): this;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Query\ScoreQuery.
     * These queries are used to search for documents and score them with a ranking
     */
    addQuery(filter: SingleFilter, score: number, scoreField?: string | null): this;
    /**
     * @param {Object} groupField
     */
    addGroupField(groupField: GroupField): this;
    /**
     * Allows grouping the result by a specific field
     */
    addGrouping(field: string): this;
    /**
     * Allows loading partial fields for the result.
     */
    addFields(...field: string[]): this;
    /**
     * @param {Object} aggregation
     */
    addAggregation(aggregation: Aggregation): this;
    /**
     * Ensures that a criterion is created for each segment of the passed path.
     * Existing Criteria objects are not overwritten.
     * Returns the own instance
     */
    addAssociation(path: string): this;
    /**
     * Ensures that a criterion is created for each segment of the passed path.
     * Returns the criteria instance of the last path segment
     */
    getAssociation(path: string): Criteria;
    getAssociationCriteria(part: string): Criteria | null;
    getLimit(): number;
    getPage(): number;
    getCriteriaData(): {
        page: Criteria['page'];
        limit: Criteria['limit'];
        term: Criteria['term'];
        filters: Criteria['filters'];
        ids: Criteria['ids'];
        queries: Criteria['queries'];
        associations: Criteria['associations'];
        postFilter: Criteria['postFilter'];
        sortings: Criteria['sortings'];
        aggregations: Criteria['aggregations'];
        grouping: Criteria['grouping'];
        fields: Criteria['fields'];
        groupFields: Criteria['groupFields'];
        totalCountMode: Criteria['totalCountMode'];
        includes: Criteria['includes'];
    };
    hasAssociation(property: string): boolean;
    /**
     * Resets the sorting parameter
     */
    resetSorting(): void;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation
     * Allows to calculate the avg value for the provided field
     */
    static avg(name: string, field: string): Aggregations['avg'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\CountAggregation
     * Allows to calculate the count value for the provided field
     */
    static count(name: string, field: string): Aggregations['count'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MaxAggregation
     * Allows to calculate the max value for the provided field
     */
    static max(name: string, field: string): Aggregations['max'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MinAggregation
     * Allows to calculate the min value for the provided field
     */
    static min(name: string, field: string): Aggregations['min'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\StatsAggregation
     * Allows to calculate the sum, max, min, avg, count values for the provided field
     */
    static stats(name: string, field: string): Aggregations['stats'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\SumAggregation
     * Allows to calculate the sum value for the provided field
     */
    static sum(name: string, field: string): Aggregations['sum'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\TermsAggregation
     * Allows to fetch term buckets for the provided field
     */
    static terms(name: string, field: string, limit?: number | null, sort?: Sorting | null, aggregation?: Aggregation | null): Aggregations['terms'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\FilterAggregation
     * Allows to filter an aggregation result
     */
    static filter(name: string, filter: SingleFilter[], aggregation: Aggregation[]): Filter;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\DateHistogramAggregation
     * Allows to fetch date buckets for the provided date interval
     */
    static histogram(name: string, field: string, interval: string | null, format: string | null, aggregation: Aggregation | null, timeZone: string | null): Aggregations['histogram'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
     * Allows to sort the documents by the provided field
     */
    static sort(field: string, order?: Sorting['order'], naturalSorting?: boolean): Sorting;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
     * Allows to sort the documents by the provided field naturally
     */
    static naturalSorting(field: string, order?: Sorting['order']): Sorting;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\CountSorting.
     * Allows to sort the documents by counting associations via the provided field
     *
     * Sql representation: `ORDER BY COUNT({field}) {order}`
     */
    static countSorting(field: string, order?: Sorting['order']): Sorting;
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter.
     * This allows to filter documents where the value are contained in the provided field.
     *
     * Sql representation: `{field} LIKE %{value}%`
     */
    static contains(field: string, value: string): Filters['contains'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\PrefixFilter.
     * This allows to filter documents where the value marks the beginning of the provided field.
     *
     * Sql representation: `{field} LIKE {value}%`
     */
    static prefix(field: string, value: string): Filters['prefix'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\SuffixFilter.
     * This allows to filter documents where the value marks the end of the provided field.
     *
     * Sql representation: `{field} LIKE %{value}`
     */
    static suffix(field: string, value: string): Filters['suffix'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter.
     * This allows to filter documents where the field matches one of the provided values
     *
     * Sql representation: `{field} IN ({value}, {value})`
     */
    static equalsAny(field: string, value: (string | number | boolean | null)[]): Filters['equalsAny'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter.
     * This allows to filter documents where the field matches a defined range
     *
     * Sql representation: `{field} >= {value}`, `{field} <= {value}`, ...
     */
    static range(field: string, range: Filters['range']['parameters']): Filters['range'];
    /**
     * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter.
     * This allows to filter documents where the field matches a defined range
     *
     * Sql representation: `{field} = {value}`
     */
    static equals(field: string, value: string | number | boolean | null): Filters['equals'];
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
    static not(operator: Filters['not']['operator'], queries?: SingleFilter[]): Filters['not'];
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
    static multi(operator: Filters['multi']['operator'], queries?: SingleFilter[]): Filters['multi'];
}
export {};
