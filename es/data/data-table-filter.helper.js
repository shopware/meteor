import Criteria from './Criteria';
export function addDataTableFilters(criteria, filters) {
    filters.forEach((filter) => {
        filter.type.options.forEach((option) => {
            criteria.addFilter(Criteria.equals(filter.id, option.id));
        });
    });
    return criteria;
}
//# sourceMappingURL=data-table-filter.helper.js.map