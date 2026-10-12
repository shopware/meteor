import EntityCollection from '../data/EntityCollection';
import type { ApiContext } from '../data/EntityCollection';
import Entity from '../data/Entity';
import SerializerFactory from '../serializer';
import { handle, send } from '../../channel';
import MissingPrivilegesError from '../privileges/missing-privileges-error';
import validate from './index';

const { serialize } = SerializerFactory({
  handle: handle,
  send: send,
});

const origin = 'https://example.com';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
function createLanguage(translations: any[], total: number|null = null, aggregations: any = null): unknown {
  return new Entity('language-id', 'language' as any, {
    name: 'English',
    appMcpToolTranslations: new EntityCollection(
      '/language/language-id/app-mcp-tool-translations',
      'app_mcp_tool_translation' as any,
      {} as ApiContext,
      null,
      translations,
      total,
      aggregations,
    ),
  } as any);
}

describe('validator', () => {
  beforeEach(() => {
    window._swsdk = {
      sourceRegistry: new Set(),
      datasets: new Map(),
      subscriberRegistry: new Set(),
      adminExtensions: {
        'example-app': {
          baseUrl: origin,
          permissions: {
            read: ['language'],
          },
        },
      },
    };
  });

  it('should not require read privileges for an empty collection', () => {
    const error = validate({
      serializedData: serialize({ language: createLanguage([]) }),
      origin,
      type: 'datasetSubscribe',
      privilegesToCheck: ['read'],
    });

    expect(error).toBeNull();
  });

  [
    { name: 'a total', total: 42, aggregations: null },
    { name: 'a total of zero', total: 0, aggregations: null },
    { name: 'aggregations', total: null, aggregations: { count: { count: 42 } } },
  ].forEach(({ name, total, aggregations }) => {
    it(`should require read privileges for an empty collection with ${name}`, () => {
      const error = validate({
        serializedData: serialize({ language: createLanguage([], total, aggregations) }),
        origin,
        type: 'datasetSubscribe',
        privilegesToCheck: ['read'],
      });

      expect(error).toBeInstanceOf(MissingPrivilegesError);
      expect((error as MissingPrivilegesError).missingPrivileges).toEqual(['read:app_mcp_tool_translation']);
    });
  });

  it('should require read privileges for a collection with entities', () => {
    const translation = new Entity('translation-id', 'app_mcp_tool_translation' as any, { label: 'Tool' } as any);

    const error = validate({
      serializedData: serialize({ language: createLanguage([translation]) }),
      origin,
      type: 'datasetSubscribe',
      privilegesToCheck: ['read'],
    });

    expect(error).toBeInstanceOf(MissingPrivilegesError);
    expect((error as MissingPrivilegesError).missingPrivileges).toEqual(['read:app_mcp_tool_translation']);
  });

  it('should require read privileges for the entity itself', () => {
    window._swsdk.adminExtensions['example-app'].permissions = {};

    const error = validate({
      serializedData: serialize({ language: createLanguage([]) }),
      origin,
      type: 'datasetSubscribe',
      privilegesToCheck: ['read'],
    });

    expect(error).toBeInstanceOf(MissingPrivilegesError);
    expect((error as MissingPrivilegesError).missingPrivileges).toEqual(['read:language']);
  });

  it('should still require write privileges for an empty collection', () => {
    window._swsdk.adminExtensions['example-app'].permissions = {
      create: ['language'],
      delete: ['language'],
      read: ['language'],
      update: ['language'],
    };

    const error = validate({
      serializedData: serialize({ language: createLanguage([]) }),
      origin,
      type: 'datasetUpdate',
      privilegesToCheck: ['create', 'delete', 'update', 'read'],
    });

    expect(error).toBeInstanceOf(MissingPrivilegesError);
    expect((error as MissingPrivilegesError).missingPrivileges).toEqual([
      'create:app_mcp_tool_translation',
      'delete:app_mcp_tool_translation',
      'update:app_mcp_tool_translation',
    ]);
  });
});
