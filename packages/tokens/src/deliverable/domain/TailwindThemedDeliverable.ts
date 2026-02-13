import { Dictionary } from '../../dictionary/domain/Dictionary.js';
import { Deliverable } from './Deliverable.js';

type Options = {
  additionalDictionaries?: Dictionary[];
};

export class TailwindThemedDeliverable implements Deliverable {
  constructor(
    private readonly lightDictionary: Dictionary,
    private readonly darkDictionary: Dictionary,
    private readonly options: Options = {},
  ) { }

  public static fromDictionaries(
    lightDictionary: Dictionary,
    darkDictionary: Dictionary,
    options: Options = {},
  ): Deliverable {
    return new this(lightDictionary, darkDictionary, options);
  }

  toString(): string {
    const allTokens = [
      ...(this.options.additionalDictionaries ?? []),
      this.lightDictionary,
      this.darkDictionary,
    ].reduce<Record<string, unknown>>(
      (accumulator, dictionary) => ({
        ...accumulator,
        ...dictionary.flat(),
      }),
      {},
    );

    const lightTokens = this.lightDictionary.flat();
    const darkTokens = this.darkDictionary.flat();

    const variables = Object.entries(lightTokens).map(([key, lightValue]) => {
      let variableName = key.replace(/\./g, '-');

      if (variableName.startsWith('scale')) {
        variableName = `spacing-${variableName}`;
      }

      if (variableName.startsWith('font-line-height-')) {
        variableName = variableName.replace('font-line-height-', 'leading-');
      }

      const darkValue = darkTokens[key];

      if (darkValue === undefined) {
        throw new Error(
          `Failed to create TailwindThemedDeliverable; Dark mode value missing for token: ${key}`,
        );
      }

      const resolvedLightValue = this.resolveAliasedTokenValue(
        lightValue,
        allTokens,
      );
      const resolvedDarkValue = this.resolveAliasedTokenValue(
        darkValue,
        allTokens,
      );

      const formattedLightValue = this.formatValue(
        resolvedLightValue,
        variableName,
      );

      if (variableName.startsWith('color-')) {
        const formattedDarkValue = this.formatValue(
          resolvedDarkValue,
          variableName,
        );

        return `--${variableName}: light-dark(${formattedLightValue}, ${formattedDarkValue});`;
      }

      return `--${variableName}: ${formattedLightValue};`;
    });

    const INDENTATION = '  ';
    const EMPTY_NEW_LINE = '\n';

    return `@theme {
${variables.map((variable) => INDENTATION + variable).join('\n')}
}

:root {
${INDENTATION}color-scheme: light;
}

[data-theme="dark"] {
${INDENTATION}color-scheme: dark;
}${EMPTY_NEW_LINE}`;
  }

  private formatValue(value: string | number, variableName: string): string {
    if (typeof value === 'string' && value.startsWith('#')) {
      return value;
    }

    if (typeof value === 'number') {
      if (!variableName.includes('weight')) {
        return `${(value / 16).toString()}rem`;
      }

      return value.toString();
    }

    return `'${value}'`;
  }

  private resolveAliasedTokenValue(
    value: string | number,
    tokens: Record<string, unknown>,
  ): string | number {
    const itIsAnAliasedToken =
      typeof value === 'string' && /^\{.+\}$/gi.test(value);

    if (itIsAnAliasedToken) {
      const pathToAliasedTokenValue = value.replace('{', '').replace('}', '');
      const resolvedValue = tokens[pathToAliasedTokenValue];

      if (
        typeof resolvedValue !== 'string' &&
        typeof resolvedValue !== 'number'
      ) {
        throw new Error(
          `Failed to create TailwindThemedDeliverable; Could not resolve value of aliased token: ${pathToAliasedTokenValue}`,
        );
      }

      const itResolvedToAnAlias =
        typeof resolvedValue === 'string' &&
        resolvedValue.startsWith('{') &&
        resolvedValue.endsWith('}');

      if (itResolvedToAnAlias) {
        return this.resolveAliasedTokenValue(resolvedValue, tokens);
      }

      return resolvedValue;
    }

    return value;
  }
}
