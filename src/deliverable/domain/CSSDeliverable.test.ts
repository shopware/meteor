import { expect, test as fact } from 'vitest';
import { CSSDeliverable } from './CSSDeliverable.js';
import { Dictionary } from '../../dictionary/application/Dictionary.js';
import { FigmaApiResponse } from '../../figma/infrastructure/FigmaApi.js';

fact('creates a CSSDeliverable with the default selector of ":root"', () => {
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

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary);
  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --blue: #0000ff;
    }"
  `);
});

fact('creates a CSSDeliverable with a custom selector', () => {
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

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary, {
    selector: '[data-theme="dark"]',
  });

  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "[data-theme=\"dark\"] {
      --blue: #0000ff;
    }"
  `);
});

fact('creates a CSSDeliverable with nested tokens', () => {
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

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary);
  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --zinc-50: #fafbfe;
    }"
  `);
});

fact('creates a CSSDeliverable with aliased token', () => {
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

  // WHEN
  const subject = CSSDeliverable.fromDictionary(adminDarkDictionary, {
    // TODO: make this property optional
    selector: ':root',
    additionalDictionaries: [primitiveTokenDictionary],
  });
  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --color-elevation-surface-default: #fafbfe;
    }"
  `);
});
