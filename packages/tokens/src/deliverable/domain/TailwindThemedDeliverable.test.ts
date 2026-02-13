import { expect, test } from 'vitest';
import { TailwindThemedDeliverable } from './TailwindThemedDeliverable.js';
import { Dictionary } from '../../dictionary/domain/Dictionary.js';
import { FigmaApiResponse } from '../../figma/infrastructure/FigmaApi.js';

test('creates a TailwindThemedDeliverable with light-dark() values', () => {
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
          modes: [{ modeId: '12362:0', name: 'Value' }],
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
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:3214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:263',
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
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Value',
    },
  );

  const subject = TailwindThemedDeliverable;

  // WHEN
  const result = subject
    .fromDictionaries(adminLightDictionary, adminDarkDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --color-elevation-surface-default: light-dark(#fafbfe, #1e1e24);
    }

    :root {
      color-scheme: light;
    }

    [data-theme="dark"] {
      color-scheme: dark;
    }
    "
  `);
});

test('creates a TailwindThemedDeliverable with multiple tokens', () => {
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
        'VariableID:12362:264': {
          id: 'VariableID:12362:264',
          name: 'blue/500',
          key: '4214fca84a5f0d56ea22ac198ad2500eaa8b547b',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'COLOR',
          valuesByMode: {
            '12362:0': {
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
        'VariableID:12362:265': {
          id: 'VariableID:12362:265',
          name: 'blue/300',
          key: '5214fca84a5f0d56ea22ac198ad2500eaa8b547b',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'COLOR',
          valuesByMode: {
            '12362:0': {
              r: 0.5019607843137255,
              g: 0.7098039215686275,
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
        'VariableCollectionId:12362:179': {
          id: 'VariableCollectionId:12362:179',
          name: 'Primitives',
          key: '2bd5662002cb0d016b4f7603cffcf825e5537bfc',
          modes: [{ modeId: '12362:0', name: 'Value' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: [
            'VariableID:12362:253',
            'VariableID:12362:263',
            'VariableID:12362:264',
            'VariableID:12362:265',
          ],
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
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:3214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:263',
              type: 'VARIABLE_ALIAS',
            },
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:2:1765': {
          id: 'VariableID:2:1765',
          name: 'color/text/primary',
          key: 'ecc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'COLOR',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:3214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:263',
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
        'VariableID:2:1766': {
          id: 'VariableID:2:1766',
          name: 'color/interactive/primary',
          key: 'fcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'COLOR',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:4214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:264',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:5214fca84a5f0d56ea22ac198ad2500eaa8b547b/12362:265',
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
          variableIds: [
            'VariableID:2:1764',
            'VariableID:2:1765',
            'VariableID:2:1766',
          ],
        },
      },
    },
  };

  const adminLightDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Light mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Value',
    },
  );

  const subject = TailwindThemedDeliverable;

  // WHEN
  const result = subject
    .fromDictionaries(adminLightDictionary, adminDarkDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --color-elevation-surface-default: light-dark(#fafbfe, #1e1e24);
      --color-text-primary: light-dark(#1e1e24, #fafbfe);
      --color-interactive-primary: light-dark(#0870ff, #80b5ff);
    }

    :root {
      color-scheme: light;
    }

    [data-theme="dark"] {
      color-scheme: dark;
    }
    "
  `);
});

test('handles numeric tokens with rem conversion', () => {
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
        'VariableID:12362:254': {
          id: 'VariableID:12362:254',
          name: 'scale/size/16',
          key: '51815235668468a5b0abd05e420f2fd252422d82',
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
          modes: [{ modeId: '12362:0', name: 'Value' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:12362:253', 'VariableID:12362:254'],
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
          name: 'spacing/default',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:51815235668468a5b0abd05e420f2fd252422d82/12362:254',
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
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Value',
    },
  );

  const subject = TailwindThemedDeliverable;

  // WHEN
  const result = subject
    .fromDictionaries(adminLightDictionary, adminDarkDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --spacing-default: 0.5rem;
    }

    :root {
      color-scheme: light;
    }

    [data-theme="dark"] {
      color-scheme: dark;
    }
    "
  `);
});

test('preserves font-weight as unitless number', () => {
  // GIVEN
  const primitiveTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:12362:253': {
          id: 'VariableID:12362:253',
          name: 'font/weight/400',
          key: '41815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '12362:0': 400,
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:12362:254': {
          id: 'VariableID:12362:254',
          name: 'font/weight/700',
          key: '51815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '12362:0': 700,
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
          modes: [{ modeId: '12362:0', name: 'Value' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:12362:253', 'VariableID:12362:254'],
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
          name: 'font/weight/body',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'FLOAT',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:51815235668468a5b0abd05e420f2fd252422d82/12362:254',
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
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Value',
    },
  );

  const subject = TailwindThemedDeliverable;

  // WHEN
  const result = subject
    .fromDictionaries(adminLightDictionary, adminDarkDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --font-weight-body: 400;
    }

    :root {
      color-scheme: light;
    }

    [data-theme="dark"] {
      color-scheme: dark;
    }
    "
  `);
});

test('handles string tokens with quotes', () => {
  // GIVEN
  const primitiveTokenResponse: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        'VariableID:12362:253': {
          id: 'VariableID:12362:253',
          name: 'font/family/sans',
          key: '41815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'STRING',
          valuesByMode: {
            '12362:0': 'Inter',
          },
          remote: false,
          description: '',
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
        },
        'VariableID:12362:254': {
          id: 'VariableID:12362:254',
          name: 'font/family/mono',
          key: '51815235668468a5b0abd05e420f2fd252422d82',
          variableCollectionId: 'VariableCollectionId:12362:179',
          resolvedType: 'STRING',
          valuesByMode: {
            '12362:0': 'Fira Code',
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
          modes: [{ modeId: '12362:0', name: 'Value' }],
          defaultModeId: '12362:0',
          remote: false,
          hiddenFromPublishing: false,
          variableIds: ['VariableID:12362:253', 'VariableID:12362:254'],
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
          name: 'font/family/body',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'STRING',
          valuesByMode: {
            '2:1': {
              id: 'VariableID:41815235668468a5b0abd05e420f2fd252422d82/12362:253',
              type: 'VARIABLE_ALIAS',
            },
            '2:2': {
              id: 'VariableID:51815235668468a5b0abd05e420f2fd252422d82/12362:254',
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
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const primitiveDictionary = Dictionary.fromFigmaApiResponse(
    primitiveTokenResponse,
    {
      mode: 'Value',
    },
  );

  const subject = TailwindThemedDeliverable;

  // WHEN
  const result = subject
    .fromDictionaries(adminLightDictionary, adminDarkDictionary, {
      additionalDictionaries: [primitiveDictionary],
    })
    .toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "@theme {
      --font-family-body: 'Inter';
    }

    :root {
      color-scheme: light;
    }

    [data-theme="dark"] {
      color-scheme: dark;
    }
    "
  `);
});

test('throws error when aliased token cannot be resolved during toString()', () => {
  // GIVEN - create dictionaries with an alias that resolves to another missing alias
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
              r: 0.98,
              g: 0.98,
              b: 0.99,
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
          modes: [{ modeId: '12362:0', name: 'Value' }],
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
          name: 'color/primary',
          key: 'dcc4dd0912912eb8216b47a914b6a8ed017a43f4',
          variableCollectionId: 'VariableCollectionId:2:1625',
          resolvedType: 'COLOR',
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
      remoteFiles: [primitiveTokenResponse],
    },
  );

  const adminDarkDictionary = Dictionary.fromFigmaApiResponse(
    adminTokenResponse,
    {
      mode: 'Dark mode',
      remoteFiles: [primitiveTokenResponse],
    },
  );

  // Don't provide primitive dictionary to additionalDictionaries
  // so the aliased token cannot be resolved during toString()
  const subject = TailwindThemedDeliverable;

  // WHEN / THEN
  expect(() =>
    subject
      .fromDictionaries(adminLightDictionary, adminDarkDictionary)
      .toString(),
  ).toThrowError(
    'Failed to create TailwindThemedDeliverable; Could not resolve value of aliased token:',
  );
});
