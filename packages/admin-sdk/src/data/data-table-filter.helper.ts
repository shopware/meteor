import Criteria from './Criteria';

interface Filter {
  id: string;
  label: string;
  type: {
    id: string;
    options: Option[];
  };
}

export interface Option {
  id: string;
  label: string;
}

export function addDataTableFilters(
  criteria: Criteria,
  filters: Filter[]
): Criteria {
  filters.forEach((filter) => {
    filter.type.options.forEach((option) => {
      criteria.addFilter(Criteria.equals(filter.id, option.id));
    });
  });

  return criteria;
}
