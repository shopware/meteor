import { expect, test } from 'vitest';
import { TailwindDeliverable } from './TailwindDeliverable.js';
import { Dictionary } from '../../dictionary/domain/Dictionary.js';
import { FigmaApiResponse } from '../../figma/infrastructure/FigmaApi.js';

test('creates a TailwindDeliverable with @theme block', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:11953:115880': {
          id: 'VariableID:11953:115880',
          name: 'blue',
          key: 'db9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'COLOR',
          valuesByMode: {
            '11953:0': {
              r: 0,
              g: 0,
              b: 1,
              a: 1,
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'red',
          key: 'dc9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'COLOR',
          valuesByMode: {
            '11953:0': {
              r: 1,
              g: 0,
              b: 0,
              a: 1,
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:11953:115879': {
          id: 'VariableCollectionId:11953:115879',
          name: '.Design Tokens',
          key: '9130479ef323598b1ccfb32e7b16dc80fcb30f14',
          modes: [{ modeId: '11953:0', name: 'Default' }],
          defaultModeId: '11953:0',
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ['VariableID:11953:115880', 'VariableID:21953:615880'],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: 'Default',
  });

  const subject = TailwindDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --blue: #0000ff;
      --red: #ff0000;
    }
    "
  `);
});

test('creates a TailwindDeliverable with nested tokens', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:11953:115880': {
          id: 'VariableID:11953:115880',
          name: 'color/brand/500',
          key: 'db9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'COLOR',
          valuesByMode: {
            '11953:0': {
              r: 0.03137254901960784,
              g: 0.4392156862745098,
              b: 1,
              a: 1,
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:11953:115879': {
          id: 'VariableCollectionId:11953:115879',
          name: '.Design Tokens',
          key: '9130479ef323598b1ccfb32e7b16dc80fcb30f14',
          modes: [{ modeId: '11953:0', name: 'Default' }],
          defaultModeId: '11953:0',
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ['VariableID:11953:115880'],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: 'Default',
  });

  const subject = TailwindDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --color-brand-500: #0870ff;
    }
    "
  `);
});

test('creates a TailwindDeliverable with spacing tokens in rem', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'scale/size/16',
          key: 'dc9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': 16,
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:11953:115879': {
          id: 'VariableCollectionId:11953:115879',
          name: '.Design Tokens',
          key: '9130479ef323598b1ccfb32e7b16dc80fcb30f14',
          modes: [{ modeId: '11953:0', name: 'Default' }],
          defaultModeId: '11953:0',
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ['VariableID:21953:615880'],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: 'Default',
  });

  const subject = TailwindDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --spacing-scale-size-16: 1rem;
    }
    "
  `);
});

test('creates a TailwindDeliverable with font weight tokens without rem conversion', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'font/weight/500',
          key: 'dc9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': 500,
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:11953:115879': {
          id: 'VariableCollectionId:11953:115879',
          name: '.Design Tokens',
          key: '9130479ef323598b1ccfb32e7b16dc80fcb30f14',
          modes: [{ modeId: '11953:0', name: 'Default' }],
          defaultModeId: '11953:0',
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ['VariableID:21953:615880'],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: 'Default',
  });

  const subject = TailwindDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --font-weight-500: 500;
    }
    "
  `);
});

test('creates a TailwindDeliverable with aliased tokens resolved', () => {
  // GIVEN
  const primitiveTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:12362:253': {
          id: 'VariableID:12362:253',
          name: 'scale/size/8',
          key: '41815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '12362:0': 8,
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:12362:179': {
          id: 'VariableCollectionId:12362:179',
          name: 'Primitives',
          key: '2bd5662002cb0d016b4f7603cffcf825e5537bfc',
          modes: [{ modeId: '12362:0', name: 'Light mode' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:12362:253'],
        },
      },
    },
  };

  const adminTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:2:1764': {
          id: 'VariableID:2:1764',
          name: 'border-radius/m',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
      variableCollections: {
        'VariableCollectionId:2:1625': {
          id: 'VariableCollectionId:2:1625',
          name: 'Tokens',
          key: '80c5c6a36e5779d966dd579fa9eb05df9537c128',
          modes: [{ modeId: '2:1', name: 'Light mode' }],
          defaultModeId: '2:1',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:2:1764'],
        },
      },
    },
  };

  const adminDictionary = Dictionary.fromFigmaApiResponse(adminTokenResponse, {
    mode: 'Light mode',
    remoteFiles: [primitiveTokenResponse],
  });

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Light mode',
    },
  );

  const subject = TailwindDeliverable;

  // WHEN
  const result = subject
    .fromDictionary(adminDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --border-radius-m: 0.5rem;
    }
    "
  `);
});
