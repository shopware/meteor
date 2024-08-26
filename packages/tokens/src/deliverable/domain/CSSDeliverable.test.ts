import { expect, test } from 'vitest';
import { CSSDeliverable } from './CSSDeliverable.js';
import { Dictionary } from '../../dictionary/domain/Dictionary.js';
import { FigmaApiResponse } from '../../figma/infrastructure/FigmaApi.js';

test('creates a CSSDeliverable with the default selector of ":root"', () => {
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

  const subject = CSSDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --blue: #0000ff;
      --red: #ff0000;
    }
    "
  `);
});

test('creates a CSSDeliverable with a custom selector', () => {
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

  const subject = CSSDeliverable;

  // WHEN
  const result = subject
    .fromDictionary(dictionary, {
      selector: '[data-theme="dark"]',
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "[data-theme="dark"] {
      --blue: #0000ff;
    }
    "
  `);
});

test('creates a CSSDeliverable with nested tokens', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:11953:115880': {
          id: 'VariableID:11953:115880',
          name: 'Zinc/50',
          key: 'db9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'COLOR',
          valuesByMode: {
            '11953:0': {
              r: 0.9803921580314636,
              g: 0.9843137264251709,
              b: 0.9960784316062927,
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

  const subject = CSSDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --zinc-50: #fafbfe;
    }
    "
  `);
});

test('creates a CSSDeliverable with aliased token', () => {
  // GIVEN
  const primitiveTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:12362:253': {
          id: 'VariableID:12362:253',
          name: 'zinc/50',
          key: '41815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'COLOR',
          valuesByMode: {
            '12362:0': {
              r: 0.9803921580314636,
              g: 0.9843137264251709,
              b: 0.9960784316062927,
              a: 1,
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:12362:263': {
          id: 'VariableID:12362:263',
          name: 'zinc/900',
          key: '3214fca84a5f0d56ea22ac198ad2500eaa8b547b',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'COLOR',
          valuesByMode: {
            '12362:0': {
              r: 0.11764705926179886,
              g: 0.11764705926179886,
              b: 0.1411764770746231,
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
        'VariableCollectionId:12362:179': {
          id: 'VariableCollectionId:12362:179',
          name: 'Primitives',
          key: '2bd5662002cb0d016b4f7603cffcf825e5537bfc',
          modes: [{ modeId: '12362:0', name: 'Light mode' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:12362:253', 'VariableID:12362:263'],
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
          name: 'color/elevation/surface/default',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'COLOR',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:244',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:3214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:179',
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
          modes: [
            { modeId: '2:1', name: 'Light mode' },
            { modeId: '2:2', name: 'Dark mode' },
          ],
          defaultModeId: '2:1',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:2:1764'],
        },
      },
    },
  };

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Light mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveTokenDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Light mode',
    },
  );

  const subject = CSSDeliverable;

  // WHEN
  const result = subject
    .fromDictionary(adminDarkDictionary, {
      selector: ':root',
      additionalDictionaries: [primitiveTokenDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --color-elevation-surface-default: #fafbfe;
    }
    "
  `);
});

test('creates a CSSDeliverable with string tokens', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'Font / Family / Heading',
          key: 'dc9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'STRING',
          valuesByMode: {
            '11953:0': 'Inter',
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

  const subject = CSSDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --font-family-heading: 'Inter';
    }
    "
  `);
});

test('creates a CSSDeliverable with font weight tokens', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'Font / Weight / 200',
          key: 'dc9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': 200,
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

  const subject = CSSDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
  ":root {
    --font-weight-200: 200;
  }
  "
`);
});

test('creates a CSSDeliverable with font weight font size', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:21953:615880': {
          id: 'VariableID:21953:615880',
          name: 'Font / Size / S',
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
          variableIds: ['VariableID:11953:115880', 'VariableID:21953:615880'],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: 'Default',
  });

  const subject = CSSDeliverable;

  // WHEN
  const result = subject.fromDictionary(dictionary).toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
  ":root {
    --font-size-s: 1rem;
  }
  "
`);
});

test('resolves an aliased token to a number value', () => {
  // GIVEN
  const primitiveTokensResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:12362:253': {
          id: 'VariableID:12362:253',
          name: 'spacing/16',
          key: '41815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '12362:0': 16,
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
          name: 'border radius/l',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
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
          modes: [
            { modeId: '2:1', name: 'Light mode' },
            { modeId: '2:2', name: 'Dark mode' },
          ],
          defaultModeId: '2:1',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:2:1764'],
        },
      },
    },
  };

  const adminLightDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Light mode',
      remoteFiles: [primitiveTokensResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokensResponse,
    {
      mode: 'Light mode',
    },
  );

  const subject = CSSDeliverable;

  // WHEN
  const result = subject
    .fromDictionary(adminLightDictionary, {
      selector: ':root',
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
  ":root {
    --border-radius-l: 1rem;
  }
  "
`);
});

test('resolves an aliased token from the same dictionary', () => {
  // GIVEN
  const adminTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:41413:11953': {
          id: 'VariableID:41413:11953',
          name: 'border radius/m',
          key: 'd7db1858980b1b6fcbde5ebbaeb48b1880c68a55',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': {
              type: 'VARIABLE_ALIAS',
              id: 'VariableID:db9aa5d3b7c6f03b4cddb78e045b566fae112d17/51413:51953',
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:64259:28974': {
          id: 'VariableID:64259:28974',
          name: 'border radius/card',
          key: 'l4dh1d48980b1b6fcbde5ebbaeb48b1880c68a55',
          variableCollectionId: 'VariableCollectionId:11953:115879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': {
              type: 'VARIABLE_ALIAS',
              id: 'VariableID:41413:11953',
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
          variableIds: ['VariableID:41413:11953', 'VariableID:64259:28974'],
        },
      },
    },
  };

  const primitiveTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variableCollections: {
        'VariableCollectionId:21953:215879': {
          id: 'VariableCollectionId:21953:215879',
          name: '.Design Tokens',
          key: '9130479ef323598b1ccfb32e7b16dc80fcb30f14',
          modes: [{ modeId: '11953:0', name: 'Default' }],
          defaultModeId: '11953:0',
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ['VariableID:51413:51953'],
        },
      },
      variables: {
        'VariableID:51413:51953': {
          id: 'VariableID:51413:51953',
          name: 'scale/size/8',
          key: 'db9aa5d3b7c6f03b4cddb78e045b566fae112d17',
          variableCollectionId: 'VariableCollectionId:21953:215879',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '11953:0': 8,
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
      },
    },
  };

  const adminLightDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Default',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Default',
    },
  );

  const subject = CSSDeliverable;

  // WHEN
  const result = subject
    .fromDictionary(adminLightDictionary, {
      selector: ':root',
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
  ":root {
    --border-radius-m: 0.5rem;
    --border-radius-card: 0.5rem;
  }
  "
`);
});
