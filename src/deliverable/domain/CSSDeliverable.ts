import { get } from '../../common/domain/utils/object.js';
import { Dictionary } from '../../dictionary/application/Dictionary.js';
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
    const cssVariables: string[] = [];

    const processToken = (token: any, prefix: string = '') => {
      if (typeof token === 'object' && token !== null) {
        for (const key in token) {
          if (token.hasOwnProperty(key)) {
            const value = token[key];
            const variableName = `${prefix}${key}`.replace('-$value', '');

            if (typeof value === 'object' && value !== null) {
              processToken(value, `${variableName}-`);
            } else if (typeof value === 'string' && key !== '$type') {
              const isAliasedToken = /\{.+\}/.test(value);

              if (isAliasedToken) {
                const pathToAliasedToken =
                  value.replace(/\{/, '').replace(/\}/, '') + '.$value';

                const aliasedValue =
                  this.options.additionalDictionaries?.reduce(
                    // @ts-expect-error
                    (accumulator, dictionary) => {
                      if (accumulator) return accumulator;
                      const value = get(dictionary.value, pathToAliasedToken);

                      if (value) {
                        return value;
                      }
                    },
                    undefined,
                  );

                cssVariables.push(`--${variableName}: ${aliasedValue};`);
              } else {
                cssVariables.push(`--${variableName}: ${value};`);
              }
            }
          }
        }
      }
    };

    processToken(this.dictionary.value);

    return `${this.options.selector} {
  ${cssVariables.join('\n')}
}`;
  }
}
