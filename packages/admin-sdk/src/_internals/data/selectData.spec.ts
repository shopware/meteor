import { selectData } from './selectData';

describe('test selectData method', () => {
  beforeAll(() => {
    /**
     * Mocking the global window "_swdsk" object
     */
    window._swsdk = {
      sourceRegistry: new Set(),
      datasets: new Map(),
      subscriberRegistry: new Set(),
      adminExtensions: {
        'https://jestjs.io': {
          baseUrl: 'https://jestjs.io',
          permissions: {
            additional: ['*'],
            create: ['*'],
            read: ['*'],
            update: ['*'],
            delete: ['*'],
          },
        },
      },
    };
  });

  it('should select string data with one path', () => {
    const sourceData = {
      a: {
        b: {
          c: 'c',
        },
      },
    };

    const selectors = ['a.b.c'];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: 'c',
        },
      },
    });
  });

  it('should select object data with one path', () => {
    const sourceData = {
      a: {
        b: {
          c: {
            d: 'd',
          },
        },
      },
    };

    const selectors = [
      'a.b.c',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: {
            d: 'd',
          },
        },
      },
    });
  });

  it('should select data with multiple paths', () => {
    const sourceData = {
      a: {
        b: {
          c: 'c',
        },
      },
      d: {
        e: 'e',
      },
    };

    const selectors = [
      'a.b.c',
      'd.e',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: 'c',
        },
      },
      d: {
        e: 'e',
      },
    });
  });

  it('should select data with multiple paths and one of them is not found', () => {
    const sourceData = {
      a: {
        b: {
          c: 'c',
        },
      },
    };

    const selectors = [
      'a.b.c',
      'd.e',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: 'c',
        },
      },
      d: {
        e: undefined,
      },
    });
  });

  it('should select array data with one path', () => {
    const sourceData = {
      a: {
        b: {
          c: ['c', 'd'],
        },
      },
    };

    const selectors = [
      'a.b.c',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: ['c', 'd'],
        },
      },
    });
  });

  it('should select array data', () => {
    const sourceData = {
      a: {
        b: {
          c: ['c', 'd'],
        },
      },
    };

    const selectors = ['a.b.c.*'];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: ['c', 'd'],
        },
      },
    });
  });

  it('should select array data with one path and one of the values is an object', () => {
    const sourceData = {
      a: {
        b: {
          c: ['c', { d: 'd' }],
        },
      },
    };

    const selectors = ['a.b.c'];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      a: {
        b: {
          c: ['c', { d: 'd' }],
        },
      },
    });
  });

  it('should select all values from array objects', () => {
    const sourceData = {
      products: [
        {
          id: 1,
          name: 'Product 1',
        },
        {
          id: 2,
          name: 'Product 2',
        },
        {
          id: 3,
          name: 'Product 3',
        },
        {
          id: 4,
          name: 'Product 4',
        },
      ],
    };

    const selectors = [
      'products.*',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      products: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
        { id: 4, name: 'Product 4' },
      ],
    });
  });

  it('should select from array object', () => {
    const sourceData = {
      products: [
        {
          id: 1,
          name: 'Product 1',
        },
        {
          id: 2,
          name: 'Product 2',
        },
        {
          id: 3,
          name: 'Product 3',
        },
        {
          id: 4,
          name: 'Product 4',
        },
      ],
    };

    const selectors = [
      'products.*.id',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      products: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
    });
  });

  it('should select multiple filtered values from array objects and one of the values is not found', () => {
    const sourceData = {
      products: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
      ],
    };

    const selectors = [
      'products.*.id',
      'products.*.price',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      products: [
        { id: 1, price: undefined },
        { id: 2, price: undefined },
        { id: 3, price: undefined },
        { id: 4, price: undefined },
      ],
    });
  });

  it('should select multiple filtered values from array objects', () => {
    const sourceData = {
      products: [
        {
          id: 1,
          name: 'Product 1',
        },
        {
          id: 2,
          name: 'Product 2',
        },
        {
          id: 3,
          name: 'Product 3',
        },
        {
          id: 4,
          name: 'Product 4',
        },
      ],
    };

    const selectors = [
      'products.*.id',
      'products.*.name',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      products: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
        { id: 4, name: 'Product 4' },
      ],
    });
  });

  it('should select multiple filtered values from nested array objects and return it in one object', () => {
    const sourceData = {
      name: 'Test',
      deep: {
        foo: {
          value: 'Jest',
        },
      },
      products: [
        {
          id: 1,
          name: 'Product 1',
          price: 100,
          variants: [
            {
              id: 1,
              name: 'Variant 1',
            },
            {
              id: 2,
              name: 'Variant 2',
            },
          ],
        },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
          variants: [
            {
              id: 3,
              name: 'Variant 3',
            },
            {
              id: 4,
              name: 'Variant 4',
            },
          ],
        },
        {
          id: 3,
          name: 'Product 3',
          price: 300,
          variants: [
            {
              id: 5,
              name: 'Variant 5',
            },
            {
              id: 6,
              name: 'Variant 6',
            },
          ],
        },
        {
          id: 4,
          name: 'Product 4',
          price: 400,
          variants: [
            {
              id: 7,
              name: 'Variant 7',
            },
            {
              id: 8,
              name: 'Variant 8',
            },
          ],
        },
      ],
    };

    const selectors = [
      'name',
      'deep.foo.value',
      'products.*.id',
      'products.*.name',
      'products.*.variants.*.id',
    ];

    const selectedData = selectData(
      sourceData,
      selectors,
      undefined,
      'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      name: 'Test',
      deep: {
        foo: {
          value: 'Jest',
        },
      },
      products: [
        {
          id: 1,
          name: 'Product 1',
          variants: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
        },
        {
          id: 2,
          name: 'Product 2',
          variants: [
            {
              id: 3,
            },
            {
              id: 4,
            },
          ],
        },
        {
          id: 3,
          name: 'Product 3',
          variants: [
            {
              id: 5,
            },
            {
              id: 6,
            },
          ],
        },
        {
          id: 4,
          name: 'Product 4',
          variants: [
            {
              id: 7,
            },
            {
              id: 8,
            },
          ],
        },
      ],
    });
  });

  it('should select specific value from array', () => {
    const sourceData = {
      products: [
        {
          id: 1,
          name: 'Product 1',
          price: 100,
        },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
        },
      ],
    };

    const selectors = [
      'products.[0].name',
      'products.[1].id',
    ];

    const selectedData = selectData(
        sourceData,
        selectors,
        undefined,
        'https://jestjs.io'
    );

    expect(selectedData).toEqual({
      products: [
        {
          name: 'Product 1',
        },
        {
          id: 2,
        },
      ],
    });
  });
});
