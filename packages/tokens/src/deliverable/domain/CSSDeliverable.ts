import { Dictionary } from '../../dictionary/domain/Dictionary.js';
import { Deliverable } from './Deliverable.js';

type Options = {
  selector: string;
  additionalDictionaries?: Dictionary[];
};

export class CSSDeliverable implements Deliverable {
  constructor(
    private readonly dictionary: Dictionary,
    private readonly options: Options,
  ) {}

  public static fromDictionary(
    dictionary: Dictionary,
    options: Options = { selector: ':root' },
  ): Deliverable {
    return new this(dictionary, options);
  }

  toString(): string {
    const allTokens = [
      ...(this.options.additionalDictionaries ?? []),
      this.dictionary,
    ].reduce<Record<string, unknown>>(
      (accumulator, dictionary) => ({
        ...accumulator,
        ...dictionary.flat(),
      }),
      {},
    );

    const variables = Object.entries(this.dictionary.flat()).map(
      ([key, value]) => {
        const variableName = key.replace(/\./g, '-');

        const resolvedValue = this.resolveAliasedTokenValue(value, allTokens);

        if (
          typeof resolvedValue === 'string' &&
          resolvedValue.startsWith('#')
        ) {
          return `--${variableName}: ${resolvedValue};`;
        }

        if (typeof resolvedValue === 'number') {
          if (!variableName.includes('weight')) {
            return `--${variableName}: ${(resolvedValue / 16).toString()}rem;`;
          }

          return `--${variableName}: ${resolvedValue.toString()};`;
        }

        return `--${variableName}: '${resolvedValue}';`;
      },
    );

    const INDENTATION = '  ';
    const EMPTY_NEW_LINE = '\n';

    return `${this.options.selector} {
${variables.map((variable) => INDENTATION + variable).join('\n')}
}${EMPTY_NEW_LINE}`;
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
          `Failed to create CSSDeliverable; Could not resolve value of aliased token: ${pathToAliasedTokenValue}`,
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
