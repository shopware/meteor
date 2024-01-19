type DictionaryValue = {
  $value: string;

  // TODO: are we able to make a union of all possible types?
  $type: string;
};

interface DictionaryTree {
  [key: string]: DictionaryTree | DictionaryValue;
}

export class Dictionary {
  // TODO: use inferred type from zod schema
  private constructor(public readonly value: DictionaryTree) {
    // TODO: add zod validation
  }

  public static fromFigmaVariables(): Dictionary {
    return new Dictionary({});
  }
}
