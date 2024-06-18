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
    const tokensInAdditionalDictionaries =
      this.options.additionalDictionaries?.reduce<Record<string, unknown>>(
        (accumulator, dictionary) => ({
          ...accumulator,
          ...dictionary.flat(),
        }),
        {},
      );

    const variables = Object.entries(this.dictionary.flat()).map(
      ([key, value]) => {
        const variableName = key.replace(/\./g, '-');
        const itIsAnAliasedToken =
          typeof value === 'string' && /^\{.+\}$/gi.test(value);

        if (itIsAnAliasedToken) {
          const pathToAliasedTokenValue = value
            .replace('{', '')
            .replace('}', '');

          if (!tokensInAdditionalDictionaries) return;

          const resolvedValue =
            tokensInAdditionalDictionaries[pathToAliasedTokenValue];

          if (typeof resolvedValue !== 'string') {
            throw new Error(
              'Failed to create CSSDeliverable; Could not resolve value of aliased token',
            );
          }

          return `--${variableName}: ${resolvedValue};`;
        }

        if (typeof value === 'string' && value.startsWith('#')) {
          return `--${variableName}: ${value};`;
        }

        if (typeof value === 'number') {
          if (!variableName.includes('weight')) {
            return `--${variableName}: ${value / 16}rem;`;
          }

          return `--${variableName}: ${value};`;
        }

        return `--${variableName}: '${value}';`;
      },
    );

    const INDENTATION = '  ';
    const EMPTY_NEW_LINE = '\n';

    return `${this.options.selector} {
${variables.map((variable) => INDENTATION + variable).join('\n')}
}${EMPTY_NEW_LINE}`;
  }
}
