import { expect, test } from 'vitest';
import { GenerateArtifacts } from './GenerateArtifacts.js';
import { InMemoryFileSystem } from './common/domain/file-system/InMemoryFileSystem.js';
import { FigmaApi } from './figma/infrastructure/FigmaApi.js';
import { env } from './env.js';
import { HttpClientUsingFetch } from './common/infrastructure/http-client/HttpClientUsingFetch.js';
import { server } from '../tests/mocks/node.js';
import { HttpResponse, http } from 'msw';

test('creates a Dictionary in form of a JSON file for the primitive Design Tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile(
    './dictionaries/foundation/primitives.tokens.json',
  );

  expect(result).toMatchInlineSnapshot(`
      "{
        "zinc": {
          "50": {
            "$value": "#fafbfe",
            "$type": "color"
          },
          "900": {
            "$value": "#1e1e24",
            "$type": "color"
          }
        }
      }
      "
    `);
});

test('creates a Dictionary in form of a JSON file for the admin light mode tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile(
    './dictionaries/administration/light.tokens.json',
  );

  expect(result).toMatchInlineSnapshot(`
      "{
        "color": {
          "elevation": {
            "surface": {
              "default": {
                "$value": "{zinc.50}",
                "$type": "color"
              }
            }
          }
        }
      }
      "
    `);
});

test('creates a Dictionary in form of a JSON file for the admin dark mode tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile(
    './dictionaries/administration/dark.tokens.json',
  );

  expect(result).toMatchInlineSnapshot(`
      "{
        "color": {
          "elevation": {
            "surface": {
              "default": {
                "$value": "{zinc.900}",
                "$type": "color"
              }
            }
          }
        }
      }
      "
    `);
});

test('creates a CSS file for the primitive Design Tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile(
    './deliverables/foundation/primitives.css',
  );

  expect(result).toMatchInlineSnapshot(`
    ":root {
      --zinc-50: #fafbfe;
      --zinc-900: #1e1e24;
    }
    "
  `);
});

test('creates a CSS file for the admin light mode tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile('./deliverables/administration/light.css');

  expect(result).toMatchInlineSnapshot(`
    ":root {
      --color-elevation-surface-default: #fafbfe;
    }
    "
  `);
});

test('creates a CSS file for the admin dark mode tokens', async () => {
  // GIVEN
  server.use(
    http.get(
      `https://api.figma.com/v1/files/${env.PRIMITIVE_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
    http.get(
      `https://api.figma.com/v1/files/${env.ADMIN_TOKENS_FILE_KEY}/variables/local`,
      () => {
        return HttpResponse.json({
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
        });
      },
    ),
  );

  const figmaApi = new FigmaApi(
    {
      apiKey: env.FIGMA_TOKEN,
    },
    new HttpClientUsingFetch(),
  );

  const fileSystem = new InMemoryFileSystem();
  const subject = new GenerateArtifacts(fileSystem, figmaApi);

  // WHEN
  await subject.execute();

  // THEN
  const result = fileSystem.readFile('./deliverables/administration/dark.css');

  expect(result).toMatchInlineSnapshot(`
    "[data-theme='dark'] {
      --color-elevation-surface-default: #1e1e24;
    }
    "
  `);
});
