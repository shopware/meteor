import { isObject, set } from '../../common/domain/utils/object.js';
import { kebabCase } from '../../common/domain/utils/string.js';
import { FigmaApiResponse } from '../../figma/infrastructure/FigmaApi.js';
import { Color } from './Color.js';

type DictionaryValue = {
  $value: string;
  $type: string;
};

type DictionaryTree = {
  [key: string]: DictionaryValue | DictionaryTree;
};

export class Dictionary {
  private constructor(public readonly value: DictionaryTree) {}

  public static fromFigmaApiResponse(
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
        `Failed to create Dictionary; Could not find mode with the name "${options.mode}"`,
      );

    const variables = Object.values(
      response.meta.variables,
    ).reduce<DictionaryTree>((accumulator, variable) => {
      const rawValue = variable.valuesByMode[modeId];

      const isStringValue = variable.resolvedType === 'STRING';
      if (isStringValue) {
        set(accumulator, kebabCase(variable.name), {
          $value: rawValue,
          $type: variable.resolvedType.toLocaleLowerCase(),
        });
      }

      const isFloatValue = variable.resolvedType === 'FLOAT';
      if (isFloatValue) {
        set(accumulator, kebabCase(variable.name), {
          $value: rawValue,
          $type: variable.resolvedType.toLocaleLowerCase(),
        });
      }

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

          const referencingVariableFromSameFile = !rawValue.id.includes('/');
          if (referencingVariableFromSameFile) {
            const resolvedVariable = Object.values(
              remoteFile.meta.variables,
            ).find((variable) => variable.id === rawValue.id);

            if (!resolvedVariable) return undefined;

            return kebabCase(resolvedVariable.name);
          }

          const START_OF_KEY = 11;
          const END_OF_KEY = 51;
          const variableKey = rawValue.id.slice(START_OF_KEY, END_OF_KEY);

          const resolvedVariable = Object.values(
            remoteFile.meta.variables,
          ).find((variable) => variable.key === variableKey);

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
    const EMPTY_NEW_LINE = '\n';

    return JSON.stringify(this.value, null, 2) + EMPTY_NEW_LINE;
  }

  public flat() {
    function getToken(
      input: unknown,
      accumulator: Record<string, string | number>,
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
            (typeof value === 'string' || typeof value === 'number')
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
