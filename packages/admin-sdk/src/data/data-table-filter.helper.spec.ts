import Criteria from './Criteria';
import { addDataTableFilters } from './data-table-filter.helper';

describe('src/app/service/criteria-helper.service.ts', () => {
  describe('addDataTableFilters', () => {
    it.each([
      { filters: [], expected: new Criteria() },
      {
        filters: [
          {
            id: 'test',
            label: 'Test',
            type: {
              id: 'options',
              options: [],
            },
          },
        ],
        expected: new Criteria(),
      },
      {
        filters: [
          {
            id: 'test',
            label: 'Test',
            type: {
              id: 'options',
              options: [
                {
                  id: 'test',
                  label: 'Test',
                },
              ],
            },
          },
        ],
        expected: new Criteria().addFilter(Criteria.equals('test', 'test')),
      },
      {
        filters: [
          {
            id: 'test',
            label: 'Test',
            type: {
              id: 'options',
              options: [
                {
                  id: 'test',
                  label: 'Test',
                },
                {
                  id: 'test2',
                  label: 'Test2',
                },
              ],
            },
          },
        ],
        expected: new Criteria()
          .addFilter(Criteria.equals('test', 'test'))
          .addFilter(Criteria.equals('test', 'test2')),
      },
      {
        filters: [
          {
            id: 'test',
            label: 'Test',
            type: {
              id: 'options',
              options: [
                {
                  id: 'test',
                  label: 'Test',
                },
              ],
            },
          },
          {
            id: 'test2',
            label: 'Test2',
            type: {
              id: 'options',
              options: [
                {
                  id: 'test2',
                  label: 'Test2',
                },
              ],
            },
          },
        ],
        expected: new Criteria()
          .addFilter(Criteria.equals('test', 'test'))
          .addFilter(Criteria.equals('test2', 'test2')),
      },
    ])('should adds filters to criteria', ({ filters, expected }) => {
      const result = addDataTableFilters(new Criteria(), filters);

      expect(result).toStrictEqual(expected);
    });
  });
});
