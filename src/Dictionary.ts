import { type FigmaVariable, type FigmaVariableCollection } from "./figmaApi";

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

  public static fromFigmaVariables({
    variables,
    collections,
  }: {
    variables: FigmaVariable[];
    collections: FigmaVariableCollection[];
  }): Dictionary {
    const tokens = variables.reduce((accumulator, variable) => {
      console.log({ variable });

      accumulator[variable.name] = {
        $value: "#0000FF",
        $type: variable.resolvedType.toLowerCase(),
      };

      return accumulator;
    }, {});

    return new Dictionary(tokens);
  }
}
