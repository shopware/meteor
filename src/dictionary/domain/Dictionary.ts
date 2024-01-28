import { aC } from 'vitest/dist/reporters-rzC174PQ.js';
import { isObject, set } from '../../common/domain/utils/object.js';
import { kebabCase } from '../../common/domain/utils/string.js';
import {
  FigmaApiResponse,
  type FigmaVariable,
} from '../../figma/infrastructure/FigmaApi.js';
import { Color } from './Color.js';

type DictionaryValue = {
  $value: string;

  // TODO: are we able to make a union of all possible types?
  $type: string;
};

type DictionaryTree = {
  [key: string]: DictionaryValue | DictionaryTree;
};

export class Dictionary {
  // TODO: use inferred type from zod schema
  private constructor(public readonly value: DictionaryTree) {
    // TODO: add zod validation
  }

  public static fromFigmaApiResponse(
    // TODO: use inferred type from zod schema
    response: FigmaApiResponse,
    options: {
      mode: string;
      remoteFiles?: FigmaApiResponse[];
    },
  ): Dictionary {
    const modeId = Object.values(response.meta.variableCollections).reduce<
      undefined | string
    >((accumulator, collection) => {
      if (accumulator) return accumulator;

      return collection.modes.find((mode) => mode.name === options.mode)
        ?.modeId;
    }, undefined);

    if (!modeId)
      throw new Error(
        `Failed to create Dictionary; Could not find mode with the name "${modeId}"`,
      );

    const variables = Object.values(
      response.meta.variables,
    ).reduce<DictionaryTree>((accumulator, variable) => {
      const rawValue = variable.valuesByMode[modeId];

      const isColorValue =
        variable.resolvedType === 'COLOR' &&
        typeof rawValue === 'object' &&
        'r' in rawValue;

      if (isColorValue) {
        set(accumulator, kebabCase(variable.name), {
          $value: Color.fromRGB(
            rawValue.r * 255,
            rawValue.g * 255,
            rawValue.b * 255,
            rawValue.a,
          ).toHex(),
          $type: variable.resolvedType.toLocaleLowerCase(),
        });
      }

      const isAliasedValue = typeof rawValue === 'object' && 'type' in rawValue;
      if (isAliasedValue) {
        const pathToAliasedToken = [
          response,
          ...(options.remoteFiles ?? []),
        ].reduce<undefined | string>((accumulator, remoteFile) => {
          if (accumulator) return accumulator;

          const START_OF_ID = 52;
          const variableId = `VariableID:${rawValue.id.slice(START_OF_ID)}`;

          const resolvedVariable = remoteFile.meta.variables[variableId];
          if (!resolvedVariable) return undefined;

          return kebabCase(resolvedVariable.name);
        }, undefined);

        if (!pathToAliasedToken)
          throw new Error(
            `Failed to resolve aliased Token; Could not find token with the id "${rawValue.id}".`,
          );

        set(accumulator, kebabCase(variable.name), {
          $value: `{${pathToAliasedToken}}`,
          $type: variable.resolvedType.toLocaleLowerCase(),
        });
      }

      return accumulator;
    }, {});

    return new this(variables);
  }

  public toJSON() {
    return JSON.stringify(this.value, null, 2);
  }

  public flat() {
    function getToken(
      input: unknown,
      accumulator: Record<string, string>,
      path?: string,
    ) {
      if (isObject(input)) {
        const entries = Object.entries(input);

        for (let index = 0; index < entries.length; index++) {
          const [key, value] = entries[index] as [string, unknown];

          if (isObject(value)) {
            const newPath = `${path ?? ''}${path ? '.' : ''}${key}`;

            getToken(value, accumulator, newPath);
          }

          if (
            key === '$value' &&
            typeof path === 'string' &&
            typeof value === 'string'
          ) {
            accumulator[path] = value;
          }
        }

        return accumulator;
      }

      return accumulator;
    }

    return getToken(this.value, {});
  }
}
