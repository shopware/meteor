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
        const itIsAnAliasedToken = /^\{.+\}$/gi.test(value);

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

        return `--${variableName}: ${value};`;
      },
    );

    return `${this.options.selector} {
  ${variables.join('\n')}
}`;
  }
}
