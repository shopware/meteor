import { Color } from "./Color";
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
      const collection = collections.find(
        (collection) => collection.id === variable.variableCollectionId
      );

      if (!collection)
        throw new Error(
          `Failed to create dictionary: Could not find collection for variable with id: ${variable.id}`
        );

      if (collection.modes.length === 1) {
        const rawValue = variable.valuesByMode[collection.modes[0].modeId];
        if (typeof rawValue !== "object" || "r" in rawValue === false)
          throw new Error(
            "Failed to create dictionary: Value is not a color value"
          );

        accumulator[variable.name] = {
          $value: Color.fromRGB(
            rawValue.r * 255,
            rawValue.g * 255,
            rawValue.b * 255,
            rawValue.a
          ).toHex(),
          $type: variable.resolvedType.toLowerCase(),
        };
      }

      return accumulator;
    }, {});

    return new Dictionary(tokens);
  }
}
